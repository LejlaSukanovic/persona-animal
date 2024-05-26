// Import the functions you need from the SDKs you need
const { Collapse } = require("@mui/material");
const { firestore } = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection, getDoc, query, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCtmYkG21BWAVvBWvcQK_37WASiOblZfu0",
  authDomain: "persona-animal.firebaseapp.com",
  projectId: "persona-animal",
  storageBucket: "persona-animal.appspot.com",
  messagingSenderId: "1058821968426",
  appId: "1:1058821968426:web:a4184540db9543f62da953",
  measurementId: "G-35F5E6BXKV"
};

let app;
let firestoreDB;

const initializeFBApp = () => {
    try{
        app = initializeApp(firebaseConfig);
        firestoreDB = getFirestore();
        return app;
    }catch (error){
        console.log(error)

    }
};

const getFirebaseApp = () => app;

const uploadProcessedData = async() => {
    const dataToUpload = {
        key1: "Test"
    };

    try{
        const document = doc(firestoreDB, "entiteta", "1");
        let dataUpdated = await setDoc(document, dataToUpload);
        return dataUpdated;
    } catch(error){
        console.log(error);
    };

};

const getTheData = async(from, to) => {
    try{
        const collectionRef = collection(firestoreDB, "entiteta");
        const finalData = [];
        const q = query(collectionRef);

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            finalData.push(doc.data())
        });
        
        return finalData;



    }catch(error){  
        console.log(error);
    }
}

module.exports = {
    initializeFBApp,
    getFirebaseApp,
    uploadProcessedData,
    getTheData
};