const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection, getDocs, query, where, updateDoc, orderBy, limit, getDoc} = require("firebase/firestore");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} = require('firebase/auth');
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
        if (!admin.apps.length) { // Check if the admin app is already initialized
            app = initializeApp(firebaseConfig);
            firestoreDB = getFirestore(app);
            auth = getAuth(app);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        return app;
    } catch (error) {
        console.log(error);
    }
};

const getFirebaseApp = () => app;
const getFirestoreDB = () => firestoreDB;
const getFirebaseAuth = () => auth;

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
const getOcenaByNaziv = async (naziv) => {
    try {
      const collectionRef = collection(firestoreDB, "entiteta");
      let finalData = [];
      const q = query(collectionRef, where('naziv', '==', naziv));
  
      const docSnap = await getDocs(q);
  
      docSnap.forEach((doc) => {
        finalData.push(doc.data());
      });
  
      return finalData[0];
    } catch (error) {
      console.log(error);
    }
  };

  const getOcenaByUserIdAndCategory = async (userId, category) => {
    try {
      // Retrieve the user document using the user ID
      const userDocRef = doc(firestoreDB, 'uporabnik', userId.toString());
      const userDoc = await getDoc(userDocRef);

      console.log('userDoc: ' + userDoc);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('user doc entiteta id: '+ userData[category]);
        const entityId = userData[category]; // Assuming the user document contains a field 'idEntiteta'
  
        // Retrieve the entity document from the specified category using the extracted entity ID
        const entityDocRef = collection(firestoreDB, 'entiteta', entityId.toString());
        const entityDoc = await getDoc(entityDocRef);
  
        if (entityDoc) {
          return entityDoc.data(); // Assuming there is only one matching document
        } else {
          console.log(`No entity found for ID: ${entityId} and category: ${category}`);
          return null;
        }
      } else {
        console.log(`No user found for ID: ${userId}`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving entity:', error);
      return null;
    }
  };

const deleteOcena = async (idUporabnik, kategorija) => {
    try {
        console.log(kategorija);
        const documentRef = doc(firestoreDB, "uporabnik", idUporabnik.toString());
        await updateDoc(documentRef, {
            [kategorija]: 0
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

const saveResultSamoocenitve = async (idUporabnik, idEntiteta, kategorija) => {
    try {
        const documentRef = doc(firestoreDB, "uporabnik", idUporabnik.toString());
        await updateDoc(documentRef, {
            [kategorija]: idEntiteta
        });
    } catch (error) {
        console.log('Error updating document:', error);
    }
};

const getNextUserId = async () => {
    const collectionRef = collection(firestoreDB, "uporabnik");
    const q = query(collectionRef, orderBy("idUporabnik", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return 1; // Start with ID 1 if no users exist
    } else {
        const highestId = querySnapshot.docs[0].data().idUporabnik;
        return highestId + 1;
    }
};

const saveUserData = async (user, username) => {
    const newUserId = await getNextUserId();
    const documentRef = doc(firestoreDB, "uporabnik", newUserId.toString());
    await setDoc(documentRef, {
        idUporabnik: newUserId,
        email: user.email,
        username: username
    });
    return newUserId;
};

const checkIfEmailExistsInDatabase = async (email) => {
    const collectionRef = collection(firestoreDB, "uporabnik");
    const q = query(collectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

const deleteUserByEmail = async (email) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);
        console.log(`Successfully deleted user: ${userRecord.uid}`);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.log('User not found, nothing to delete.');
        } else {
            throw error;
        }
    }
};

//ujemanje

const getUporabniki = async () => {
    try {
      const uporabnikCollectionRef = collection(firestoreDB, "uporabnik");
      const entitetaCollectionRef = collection(firestoreDB, "entiteta");
  
      const uporabnikData = [];
      const kategorijeSet = new Set();
      const entitetaMap = new Map();
  
      // Fetch all users
      const uporabnikSnap = await getDocs(query(uporabnikCollectionRef));
      uporabnikSnap.forEach(doc => {
        uporabnikData.push(doc.data());
      });
  
      // Fetch all entities from entiteta
      const entitetaSnap = await getDocs(query(entitetaCollectionRef));
      entitetaSnap.forEach(doc => {
        const data = doc.data();
        if (data.kategorija) {
          kategorijeSet.add(data.kategorija);
        }
        entitetaMap.set(data.idEntiteta, data);
      });
  
      const kategorije = Array.from(kategorijeSet);
  
      return { uporabnikData, kategorije, entitetaMap };
    } catch (error) {
      console.log(error);
    }
  };

  
const calculateUjemanje = async (entiteta1, entiteta2) => {
    try {

        if(entiteta1 === entiteta2){
            return 1;
        }
      // Access the 'ujemanja' sub-collection of 'entiteta1'
      const entiteta1DocRef = doc(firestoreDB, 'entiteta', entiteta1);
      const ujemanjeDocRef = doc(firestoreDB, 'entiteta', entiteta1, 'ujemanja', entiteta2);
      const ujemanjeDoc = await getDoc(ujemanjeDocRef);
  
      if (ujemanjeDoc.exists()) {
        // Retrieve the 'ocena_ujemanja' field from the document
        const ocenaUjemanja = ujemanjeDoc.data().ocena_ujemanja;
        return ocenaUjemanja;
      } else {
        console.log(`No matching document found for entiteta2: ${entiteta2} in the ujemanja sub-collection of entiteta1: ${entiteta1}`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving ocena_ujemanja:', error);
      return null;
    }
  };

  const getOpisUjemanja = async (idOdnos) => {
    try {
      // Reference the document in the 'odnosi' collection with the given idOdnos
      const odnosDocRef = doc(firestoreDB, 'odnosi', idOdnos.toString());
      const odnosDoc = await getDoc(odnosDocRef);
  
      if (odnosDoc.exists()) {
        // Retrieve the 'opis' field from the document
        const opisUjemanja = odnosDoc.data().opis;
        return opisUjemanja;
      } else {
        console.log(`No matching document found for idOdnos: ${idOdnos}`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving opis ujemanja:', error);
      return null;
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
    deleteOcena,
    getUporabniki,
    getFirebaseAuth,
    getFirestoreDB,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    saveUserData,
    checkIfEmailExistsInDatabase,
    deleteUserByEmail,
    app,
    firestoreDB,
    getNextUserId,
    calculateUjemanje,
    getOcenaByNaziv,
    getOpisUjemanja,
    getOcenaByUserIdAndCategory
};