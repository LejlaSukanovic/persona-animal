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

router.get('/pregledOcenitve/:kategorija', async (req, res) => {
    const ocena = req.session.categoryId;
    if (ocena) {
        const data = await getOcena(ocena);
        req.session.categoryId = undefined;
        res.render('PregledOcenitve', { entity: data });
    } else {
        // Handle missing data
        console.error('Error fetching data:', error);
        res.redirect('/errorPage');
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
    const uporabnik = await getUporabnikByID(req.session.user.id);     
    
    // If user does not have an entiteta, redirect to the selection page
    if (uporabnik[category] == 0 || !uporabnik[category]) {
        res.redirect('/samoocenitev/izbiraEntitete/' + category);
    } else {
        // Otherwise, redirect to the review page        
        req.session.categoryId = uporabnik[category];
        res.redirect('/samoocenitev/pregledOcenitve/'+category);
        
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
        req.session.categoryId = entitetaID;
        res.redirect(`/samoocenitev/pregledOcenitve/${kategorija}`);
    } catch (error) {
        console.log(error);
    }
});




module.exports = router;