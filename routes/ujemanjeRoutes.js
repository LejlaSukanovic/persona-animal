const express = require('express');
const {getUporabniki} = require('../Database/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { uporabnikData, kategorije, entitetaMap } = await getUporabniki(); // Fetch all users and categories
        res.render('zgodovinaUjemanja', { uporabniki: uporabnikData, kategorije, entitetaMap });
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
});

router.delete('/deleteUser/:idUporabnik', async (req, res) => {
    const idUporabnik = req.params.idUporabnik;

    try {
        const userRef = doc(firestoreDB, 'uporabnik', idUporabnik);
        await deleteDoc(userRef);
        res.status(200).send('User deleted');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Failed to delete user');
    }
});

module.exports = router;