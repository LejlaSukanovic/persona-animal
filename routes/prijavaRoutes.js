const express = require('express');
const { initializeFBApp, getFirebaseAuth, checkIfEmailExistsInDatabase, deleteUserByEmail, createUserWithEmailAndPassword, saveUserData, signInWithEmailAndPassword, getUporabnikByUID } = require('../Database/firebase');

initializeFBApp();

const router = express.Router();
const auth = getFirebaseAuth();

// Registration route
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const emailExists = await checkIfEmailExistsInDatabase(email);
        if (emailExists) {
            return res.status(400).json({ error: 'Email is already in use in the database. Please try a different email.' });
        }

        await deleteUserByEmail(email);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await saveUserData(user, username);

        return res.status(201).json({ message: 'User registered successfully!', user: user.uid });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const uporabnik = await getUporabnikByUID(user.uid);
        console.log('Fetched uporabnik:', uporabnik); // Add logging here

        if (!uporabnik) {
            return res.status(404).json({ error: 'User not found in database.' });
        }

        // Save idUporabnik to session storage
        req.session.user = {
            id: uporabnik.idUporabnik,
            email: user.email
        };

        console.log('Saving to session:', req.session.user); // Add logging here

        return res.status(200).json({ 
            message: 'User logged in successfully!', 
            user: user.uid,
            idUporabnik: uporabnik.idUporabnik  // Send idUporabnik back to the client
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: error.message });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully.' });
    });
});


module.exports = router;