const path = require('path');
const { config } = require('dotenv');
config({ path: path.resolve(__dirname, '../.env') });
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require('firebase/auth');
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); 

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
  
  let app = initializeApp(firebaseConfig);
  let firestoreDB =getFirestore(app);
  let auth;
  
  const initializeFBApp = () => {
      try {
          if (!admin.apps.length) {
              app = initializeApp(firebaseConfig);
              firestoreDB = getFirestore(app);
              auth = getAuth(app);
              admin.initializeApp({
                  credential: admin.credential.cert(serviceAccount)
              });
          }
          return app;
      } catch (error) {
          console.log('Error initializing Firebase app:', error);
      }
  };
  
  const getFirebaseApp = () => app;
  const getFirestoreDB = () => firestoreDB;
  const getFirebaseAuth = () => auth;


module.exports = {
    initializeFBApp,
    getFirebaseApp,
    getFirestoreDB,
    getFirebaseAuth,
    getStorageBucket,
    app
};
