// Import the functions you need from the SDKs you need
const { Collapse } = require("@mui/material");
const { firestore } = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc } = require("firebase/firestore");

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

const getTheData = async(category) => {
    try{
        const collectionRef = collection(firestoreDB, "entiteta");
        const finalData = [];
        const q = query(collectionRef, where('kategorija', '==', `${category}`));

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            finalData.push(doc.data())
        });
        
        return finalData;



    }catch(error){  
        console.log(error);
    }
}

const getUporabnik = async(id) => {
    try{
        const collectionRef = collection(firestoreDB, "uporabnik");
        let finalData = [];
        const q = query(collectionRef, where('idUporabnik', '==', id));

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            finalData.push(doc.data())
        });
        
        return finalData[0];
    }catch(error) {
        console.log(error);
    }
}

const getOcena = async (entitetaID) => {
    try{
        const collectionRef = collection(firestoreDB, "entiteta");
        let finalData = [];
        const q = query(collectionRef, where('idEntiteta', '==', entitetaID));

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            finalData.push(doc.data())
        });
        
        return finalData[0];
    }catch(error) {
        console.log(error);
    }
}

const deleteOcena = async (idUporabnik) => {
    try {
        const documentRef = doc(firestoreDB, "uporabnik", idUporabnik.toString());
        await updateDoc(documentRef, {
            entiteta: 0
        });
    } catch (error) {
        console.log('Error updating document:', error);
    }
};

const getAllCategories = async() => {
    try {
        const collectionRef = collection(firestoreDB, "entiteta");
        const docSnap = await getDocs(collectionRef);
        
        const categories = new Set();
        docSnap.forEach((doc) => {
            const data = doc.data();
            if (data.kategorija) {
                categories.add(data.kategorija);
            }
        });

        return Array.from(categories);  // Convert Set to Array
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const saveResultSamoocenitve = async (idUporabnik, idEntiteta) => {
    try {
        const documentRef = doc(firestoreDB, "uporabnik", idUporabnik.toString());
        await updateDoc(documentRef, {
            entiteta: idEntiteta
        });
    } catch (error) {
        console.log('Error updating document:', error);
    }
};

module.exports = {
    initializeFBApp,
    getFirebaseApp,
    uploadProcessedData,
    getTheData,
    getUporabnik,
    getOcena,
    getAllCategories,
    saveResultSamoocenitve,
    deleteOcena
};