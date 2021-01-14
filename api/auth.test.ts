import type { Auth } from './auth'
import firebase from 'firebase/app'

describe('Auth Service', () => {
  let sut: Auth

  beforeEach(async () => {
    jest.resetModules()
    process.env.firebaseConfig = '{}'
    ;(process as any).browser = 'truthy value'
    const module = await import('./auth')
    sut = module.auth
  })

  test('should return the current user', async () => {
    // when
    const user = await sut.getCurrentUser()

    // then
    expect(user?.name).toBe('Test User')
  })

  test('should evaluate the avatar from a list of providers', async () => {
    // given
    const mockUser: Partial<firebase.User> = {
      displayName: 'Test User',
      email: 'test@example.com',
      providerData: [
        {
          photoURL: null,
        } as firebase.UserInfo,
        {
          photoURL: 'http://example.com/avatar',
        } as firebase.UserInfo,
      ],
    }
    ;(firebase.auth()
      .onAuthStateChanged as jest.Mock).mockImplementation((cb) => cb(mockUser))

    // when
    const user = await sut.getCurrentUser()

    // then
    expect(user?.avatar).toBe('http://example.com/avatar')
  })

  test('should sign in with apple', async () => {
    await expect(sut.signInWithApple()).resolves.toEqual(undefined)
  })
})
