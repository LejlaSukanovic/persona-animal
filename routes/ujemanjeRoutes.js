const express = require('express');
const {getUporabniki, deleteOcena} = require('../Database/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { uporabnikData, kategorije, entitetaMap } = await getUporabniki(); // Fetch all users and categories
        res.render('zgodovinaUjemanja', { uporabniki: uporabnikData, kategorije, entitetaMap });
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
});

router.get('/deleteUser/:idUporabnik/:kategorija', async (req, res) => {
    const idUporabnik = req.params.idUporabnik;
    const kategorija = req.params.kategorija;

    try {
        await deleteOcena(idUporabnik, kategorija);
        res.status(200).send('updated');
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).send('Failed to update');
    }
});

module.exports = router;