const { getFirestoreDB } = require('./firebaseInit');
const { doc, getDocs, query, where, updateDoc, collection, getDoc, deleteDoc } = require("firebase/firestore");

const firestoreDB = getFirestoreDB();

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
    } catch(error) {
        console.log('Error getting the data:', error);
    }
};

const getOcena = async (entitetaID) => {
    try {
        const collectionRef = collection(firestoreDB, "entiteta");
        let finalData = [];
        const q = query(collectionRef, where('idEntiteta', '==', entitetaID));

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            finalData.push(doc.data())
        });
        
        return finalData[0];
    } catch(error) {
        console.log('Error getting rating:', error);
    }
};

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

const deleteOcena = async (idUporabnik, kategorija, isMatchingDeletion = false) => {
    try {
        const documentRef = doc(firestoreDB, "uporabnik", idUporabnik.toString());

        // Fetch the user's current data before deletion
        const userDoc = await getDoc(documentRef);
        const userData = userDoc.data();
        const entitetaId = userData[kategorija];

        // Delete the self-assessment
        await updateDoc(documentRef, {
            [kategorija]: 0
        });

        if (!isMatchingDeletion) {
            const usersQuery = query(collection(firestoreDB, "uporabnik"), where("ujemanjeZ", "==", idUporabnik));
            const usersSnapshot = await getDocs(usersQuery);


            for (const userDoc of usersSnapshot.docs) {
                await deleteDoc(userDoc.ref);
            }
        }
        //Treba dodati, u slucaju ako je matchingDeletion true tj. da user brise samo specificno ujemanje da ce se to izbrisati.Sada to radi medjutim samo na frontendu iz baze se ne brise. U principu moze i tako sve da radi ali bilo bi bolje da se izbrise iz baze istovremeno taj novo dodani user za ujemanje. 
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

        return Array.from(categories);
    } catch (error) {
        console.log('Error getting all categories:', error);
        throw error;
    }
};

const saveResultSamoocenitve = async (idUporabnik, idEntiteta, kategorija) => {
    try {
        const documentRef = doc(firestoreDB, "uporabnik", idUporabnik.toString());
        await updateDoc(documentRef, {
            [kategorija]: idEntiteta
        });
    } catch (error) {
        console.log('Error saving self-assessment result:', error);
    }
};

module.exports = {
    getTheData,
    getOcena,
    getOcenaByNaziv,
    getOcenaByUserIdAndCategory,
    deleteOcena,
    getAllCategories,
    saveResultSamoocenitve
}




