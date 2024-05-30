const {getFirestoreDB, app } = require("../Database/firebaseInit")
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc, getDocs, query, where, orderBy, limit, updateDoc, collection } = require("firebase/firestore");
const admin = require('firebase-admin');

let firestoreDB = getFirestoreDB(app);

const getNextUserId = async () => {
    try {
        const collectionRef = collection(firestoreDB, "uporabnik");
        const q = query(collectionRef, orderBy("idUporabnik", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return 1; // Start with ID 1 if no users exist
        } else {
            const highestId = querySnapshot.docs[0].data().idUporabnik;
            return highestId + 1;
        }
    } catch (error) {
        console.log('Error getting next user ID:', error);
    }
};

const saveUserData = async (user, username) => {
    try {
        const newUserId = await getNextUserId();
        const documentRef = doc(firestoreDB, "uporabnik", newUserId.toString());
        await setDoc(documentRef, {
            idUporabnik: newUserId,
            email: user.email,
            username: username,
            uid: user.uid,
            tip: 1
        });
        return newUserId;
    } catch (error) {
        console.log('Error saving user data:', error);
    }
};

const checkIfEmailExistsInDatabase = async (email) => {
    try {
        const collectionRef = collection(firestoreDB, "uporabnik");
        const q = query(collectionRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.log('Error checking if email exists in database:', error);
    }
};

const deleteUserByEmail = async (email) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.log('User not found, nothing to delete.');
        } else {
            throw error;
        }
    }
};

const getUporabnikByUID = async (uid) => {
    try {
        const collectionRef = collection(firestoreDB, "uporabnik");
        const q = query(collectionRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        let finalData = [];
        querySnapshot.forEach((doc) => {
            finalData.push(doc.data());
        });

        return finalData[0];
    } catch (error) {
        console.log('Error getting user:', error);
        throw error;
    }
};

const getUporabnikByID = async(id) => {
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

module.exports = {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    saveUserData,
    checkIfEmailExistsInDatabase,
    deleteUserByEmail,
    getNextUserId,
    getUporabnikByUID,
    getUporabnikByID
};


