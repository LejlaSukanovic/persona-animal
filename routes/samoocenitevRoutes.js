const express = require('express');
const { getTheData, initializeFBApp, getFirebaseAuth, getFirestoreDB, getUporabnik, getOcena, getAllCategories, saveResultSamoocenitve, saveUserData, deleteUserByEmail, checkIfEmailExistsInDatabase, deleteOcena, signInWithEmailAndPassword, createUserWithEmailAndPassword, getUporabnikByID } = require('../Database/firebase');

initializeFBApp();

const router = express.Router();
const firestoreDB = getFirestoreDB();
const auth = getFirebaseAuth();

router.get('/', async (req, res) => {
    let categories = await getAllCategories();
    res.render('samoocenitev', { categories });
});

router.get('/pregledOcenitve/:ocena/:kategorija', async (req, res) => {
    try {
        const ocena = parseInt(req.params.ocena, 10);
        const data = await getOcena(ocena);
        res.render('PregledOcenitve', { entity: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

router.get('/brisanje/:ocena/:kategorija', async (req, res) => {
    try {
        const kategorija = req.params.kategorija;
        const idUporabnik = req.session.user.id;
        await deleteOcena(idUporabnik, kategorija);
        res.redirect('/samoocenitev');
    } catch (error) {
        console.log(error);
    }
});

router.get('/izvedbaSamoocenitve/:kategorija', async (req, res) => {

    const category = req.params.kategorija;
    const uporabnikID = req.session.user.id; 
    const uporabnik = await getUporabnikByID(uporabnikID);
    

    if (uporabnik[category] == 0 || !uporabnik[category]) {
        res.redirect('/samoocenitev/izbiraEntitete/' + category);
    } else {
        // Otherwise, redirect to the review page
        res.redirect(`/samoocenitev/pregledOcenitve/${uporabnik[category]}/${category}`);
    }
});




router.get('/izbiraEntitete/:kategorija', async (req, res) => {
    try {
        const category = req.params.kategorija;
        const data = await getTheData(category); //dodati u get the data da se dobiju entitete na osnovu neke kategorije
        res.render('IzbiraEntitete', { entities: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

router.get('/rezultat/:entitetaId/:kategorija', async (req, res) => {
    try {
        const entitetaID = parseInt(req.params.entitetaId, 10);
        const kategorija = req.params.kategorija
        const uporabnikID = req.session.user.id;
        await saveResultSamoocenitve(uporabnikID, entitetaID, kategorija);
        const data = await getOcena(entitetaID);
        res.redirect(`/samoocenitev/pregledOcenitve/${data.idEntiteta}/${kategorija}`);
    } catch (error) {
        console.log(error);
    }
});




module.exports = router;