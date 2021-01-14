import './firebase'
import firebase from 'firebase/app'
import nookies from 'nookies'
import { Cookies } from './domain/cookies'
import { User } from './domain/user'

export interface Auth {
  signInWithGoogle: () => void
  signInWithApple: () => void
  signInWithEmail: (email: string) => Promise<void>
  signInWithLink: () => Promise<boolean>
  getCurrentUser: () => Promise<User | null>
  signOut: () => Promise<void>
}

class FirebaseAuth implements Auth {
  private static readonly EMAIL_FOR_SIGN_IN_KEY = 'emailForSignIn'

  private isLoading = true
  private currentFirebaseUser: firebase.User | null = null
  private currentUserCallbacks: ((user: User | null) => void)[] = []

  private resolveSignInWithLink?: (signedIn: boolean) => void
  private rejectSignInWithLink?: (error: Error) => void

  private signInWithLinkPromise = new Promise<boolean>((resolve, reject) => {
    this.resolveSignInWithLink = resolve
    this.rejectSignInWithLink = reject
  })

  constructor() {
    this.initFirebase()
  }

  private initFirebase() {
    if (!process.browser) {
      return
    }

    firebase.auth().useDeviceLanguage()

    firebase.auth().onAuthStateChanged((user) => {
      console.log('onAuthChanged')
      if (this.isLoginLink()) {
        if (user) {
          this.cleanUrl()
          this.resolveUser(user)
        } else {
          this.checkLoginWithLink()
        }
      } else {
        this.resolveUser(user)
      }
    })
    firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        nookies.set(null, Cookies.TOKEN, '', {})
      } else {
        const token = await user.getIdToken()
        nookies.set(null, Cookies.TOKEN, token, {})
      }
    })
  }

  private isLoginLink() {
    return firebase.auth().isSignInWithEmailLink(window.location.href)
  }

  private checkLoginWithLink() {
    if (process.browser) {
      let email = window.localStorage.getItem(
        FirebaseAuth.EMAIL_FOR_SIGN_IN_KEY
      )
      // poor man solution for a case that very rarely happens
      while (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }
      return firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(({ user }) => {
          this.cleanUrl()
          this.resolveUser(user)

          return true
        })
        .catch((err) => {
          this.cleanUrl()
          this.rejectSignInWithLink?.(err)
          this.resolveUser(null)
        })
    } else {
      this.resolveUser(null)
    }
  }

  signInWithLink(): Promise<boolean> {
    return this.signInWithLinkPromise
  }

  private cleanUrl() {
    // remove the key from the url
    history.replaceState(null, '', window.location.href.split('?')[0])
  }

  private async resolveUser(user: firebase.User | null) {
    this.isLoading = false
    this.currentFirebaseUser = user
    await Promise.all(
      this.currentUserCallbacks.map(async (cb) => cb(await this.toUser(user)))
    )
    this.currentUserCallbacks = []
    this.resolveSignInWithLink?.(!!user)
  }

  signInWithGoogle() {
    return this.signInWithProvider(new firebase.auth.GoogleAuthProvider())
  }

  signInWithApple() {
    const provider = new firebase.auth.OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')

    return this.signInWithProvider(provider)
  }

  signInWithEmail(email: string) {
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: process.env.angleWebBaseUrl as string,
        handleCodeInApp: true,
      })
      .then(() => {
        window.localStorage.setItem(FirebaseAuth.EMAIL_FOR_SIGN_IN_KEY, email)
      })
  }

  private signInWithProvider(provider: firebase.auth.AuthProvider) {
    return firebase.auth().signInWithRedirect(provider)
  }

  getCurrentUser(): Promise<User | null> {
    if (!this.isLoading) {
      if (this.currentFirebaseUser) {
        return Promise.resolve(this.toUser(this.currentFirebaseUser))
      } else {
        return Promise.resolve(null)
      }
    }

    return new Promise((resolve) => this.currentUserCallbacks.push(resolve))
  }

  signOut(): Promise<void> {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        this.currentFirebaseUser = null
      })
  }

  private async toUser(user: firebase.User | null): Promise<User | null> {
    if (!user) {
      return Promise.resolve(null)
    }

    if (!user.email) {
      throw new Error(`Firebase is missing the email: ${JSON.stringify(user)}`)
    }

    // If there is no avatar, check if the user has logged in with other providers that have an avatar.
    const avatar =
      user.photoURL ??
      (user.providerData ?? []).reduce<string | undefined | null>(
        (acc, cur) => acc ?? cur?.photoURL,
        null
      )

    const { claims, token } = await user.getIdTokenResult()

    return {
      unlocked: claims?.angleApp?.access.status === 'granted',
      avatar: avatar ?? undefined,
      name: user.displayName ?? undefined,
      email: user.email,
      idToken: token,
    }
  }
}

export const auth: Auth = new FirebaseAuth()
