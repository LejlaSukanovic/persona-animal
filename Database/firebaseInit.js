const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require('firebase/auth');
const admin = require('firebase-admin');
const serviceAccount = require('./persona-animal-firebase-adminsdk-ge6gm-2a1d387556.json'); 

const firebaseConfig = {
    apiKey: "AIzaSyCtmYkG21BWAVvBWvcQK_37WASiOblZfu0",
    authDomain: "persona-animal.firebaseapp.com",
    projectId: "persona-animal",
    storageBucket: "persona-animal.appspot.com",
    messagingSenderId: "1058821968426",
    appId: "1:1058821968426:web:a4184540db9543f62da953",
    measurementId: "G-35F5E6BXKV"
};

let app = initializeApp(firebaseConfig);
let firestoreDB = getFirestore(app);
let auth;

const initializeFBApp = () => {
    try {
        if (!admin.apps.length) {
            app = initializeApp(firebaseConfig);
            firestoreDB = getFirestore(app);
            auth = getAuth(app);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: "persona-animal.appspot.com"
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
const getStorageBucket = () => admin.storage().bucket();

module.exports = {
    initializeFBApp,
    getFirebaseApp,
    getFirestoreDB,
    getFirebaseAuth,
    getStorageBucket,
    app
};
