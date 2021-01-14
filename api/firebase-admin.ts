import * as firebaseAdmin from 'firebase-admin'
import getConfig from 'next/config'

export function initFirebaseAdmin() {
  if (!firebaseAdmin.apps.length) {
    const { serverRuntimeConfig } = getConfig()
    console.log(serverRuntimeConfig)

    const adminConfigJson = serverRuntimeConfig.firebaseAdminConfig

    if (adminConfigJson) {
      const adminConfig: any = JSON.parse(adminConfigJson!)

      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(adminConfig),
        databaseURL: process.env.firebaseDb,
      })
    }
  }
}

export async function verifyToken(token: string): Promise<void> {
  initFirebaseAdmin()
  await firebaseAdmin.auth().verifyIdToken(token)
}

export { firebaseAdmin }
