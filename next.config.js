const withImages = require('next-images')

module.exports = () =>
  withImages({
    serverRuntimeConfig: {
      firebaseAdminConfig: process.env.FIREBASE_ADMIN_CONFIG,
    },
    env: {
      angleApiBaseUrl:
        process.env.ANGLE_API_BASE_URL ||
        'http://localhost:5001/face-2-face-dev/europe-west1',
      angleWebBaseUrl: process.env.ANGLE_WEB_URL || 'http://localhost:3000',
      firebaseConfig:
        process.env.FIREBASE_CONFIG ||
        '{"apiKey":"AIzaSyC526EZn3lGL4SRpkBeTevuhC0tu0srkiI","authDomain":"face2face-staging-1.firebaseapp.com","databaseURL":"https://face2face-staging-1.firebaseio.com","projectId":"face2face-staging-1","storageBucket":"face2face-staging-1.appspot.com","messagingSenderId":"495990472933","appId":"1:495990472933:web:78389cd01f43695c96d40c","measurementId":"G-86QWLX4D0T"}',
      firebaseDb:
        process.env.FIREBASE_DB || 'https://face2face-staging-1.firebaseio.com',
      supportEmailAddress:
        process.env.SUPPORT_EMAIL_ADDRESS || 'support@angle.audio',
      infoEmailAddress: process.env.INFO_EMAIL_ADDRESS || 'info@angle.audio',
      indexingEnabled: process.env.ENABLE_INDEXING,

      appAppleId: process.env.APP_STORE_ID || '1515120815',
      appStoreLink:
        'https://apps.apple.com/app/angle-audio-conversations/id1515120815',
      playStoreLink:
        'https://play.google.com/store/apps/details?id=app.getangle',
    },
  })
