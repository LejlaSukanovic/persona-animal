const express = require('express');
const {getUporabniki, deleteOcena, getTheData, getNextUserId, saveResultSamoocenitve, getOcena} = require('../Database/firebase');
const { getFirestore, doc, setDoc, collection, getDocs, query, where, updateDoc, orderBy, limit} = require("firebase/firestore");
const { firestoreDB } = require('../Database/firebase');
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

router.get('/novUporabnik/:category', (req, res) => {
    const category = req.params.category;
    res.render('novUporabnik', { category });
});

router.post('/dodajUporabnika/:idPrijavljenog', async (req, res) => {
    const { name, category } = req.body;
    const idPrijavljenog = parseInt(req.params.idPrijavljenog, 10);
    const newUserId = await getNextUserId();
    const newUser = {
        idUporabnik: newUserId,
        ime: name,
        ujemanjeZ : idPrijavljenog,
        [category]: 0,
        tip: 2
    };

    try {
        await setDoc(doc(firestoreDB, 'uporabnik', newUser.idUporabnik.toString()), newUser);
        res.redirect(`/ujemanje/izbiraEntitete/${newUser.idUporabnik}/${category}`);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }
});

router.get('/izbiraEntitete/:idUporabnik/:kategorija', async (req, res) => {
    try {
        const category = req.params.kategorija;
        const idUporabnik = req.params.idUporabnik || null; // Handle optional idUporabnik parameter
        const data = await getTheData(category); // Fetch entities based on category
        res.render('IzbiraEntiteteUjemanje', { entities: data, category, idUporabnik });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

router.get('/rezultat/:entitetaId/:uporabnikID/:kategorija', async(req, res) => {
    try{
        const entitetaID = parseInt(req.params.entitetaId, 10);
        const kategorija = req.params.kategorija;
        const uporabnikID = req.params.uporabnikID;
        await saveResultSamoocenitve(uporabnikID, entitetaID, kategorija);
        const data = await getOcena(entitetaID);
        res.redirect(`/ujemanje/pregledOcenitve/${data.idEntiteta}/${kategorija}`);
    }catch(error){
        console.log(error);
    }
});

module.exports = router;