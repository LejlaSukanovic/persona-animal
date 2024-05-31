const { getFirestoreDB } = require('./firebaseInit');
const { doc, getDoc, collection, getDocs, query, updateDoc } = require("firebase/firestore");

const firestoreDB = getFirestoreDB();
const calculateUjemanje = async (entiteta1, entiteta2, uporabnikID) => {
  try {
      if (entiteta1 === entiteta2) {
          return 1;
      }
      
      // Access the document in the 'ujemanja' sub-collection of 'entiteta1'
      const ujemanjeDocRef = doc(firestoreDB, 'entiteta', entiteta1, 'ujemanja', entiteta2);
      const ujemanjeDoc = await getDoc(ujemanjeDocRef);

      if (ujemanjeDoc.exists()) {
          // Retrieve the 'ocena_ujemanja' field from the document
          const ocenaUjemanja = ujemanjeDoc.data().ocena_ujemanja;

          // Access the document in the 'uporabnik' collection
          const uporabnikDocRef = doc(firestoreDB, 'uporabnik', uporabnikID);
          const uporabnikDoc = await getDoc(uporabnikDocRef);

          if (uporabnikDoc.exists()) {
              // Update the 'ocena_ujemanja' field in the 'uporabnik' document
              await updateDoc(uporabnikDocRef, {
                  ocena_ujemanja: ocenaUjemanja
              });

              return ocenaUjemanja;
          } else {
              console.log(`No matching document found for uporabnikID: ${uporabnikID}`);
              return null;
          }
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

module.exports = {
    calculateUjemanje,
    getOpisUjemanja,
    getUporabniki
};