const express = require('express');
const {getUporabnik, getUporabniki, deleteOcena, getTheData, getNextUserId, saveResultSamoocenitve, getOcena, calculateUjemanje, getOcenaByNaziv, getOpisUjemanja} = require('../Database/firebase');
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
        const ocenjeniUporabnik = await getUporabnik(parseInt(uporabnikID, 10));
        const prijavljeniUporabnik = await getUporabnik(ocenjeniUporabnik.ujemanjeZ); //mozda ce morati se promijeniti funkcija u getUporabnikById
        const ocenaPrijavljenega = await getOcena(prijavljeniUporabnik[kategorija]);
        await saveResultSamoocenitve(uporabnikID, entitetaID, kategorija);
        const data = await getOcena(entitetaID);
        res.redirect(`/ujemanje/pregledUjemanja/${data.naziv}/${ocenaPrijavljenega.naziv}`);
    }catch(error){
        console.log(error);
    }
});

router.get('/pregledUjemanja/:entiteta1/:entiteta2', async(req, res) => {
    const entiteta1Naziv = req.params.entiteta1;
    const entiteta2Naziv = req.params.entiteta2;
    const ujemanje = await calculateUjemanje(entiteta1Naziv, entiteta2Naziv);
    const entiteta1 = await getOcenaByNaziv(entiteta1Naziv);
    const entiteta2 = await getOcenaByNaziv(entiteta2Naziv);
    const opis = await getOpisUjemanja(ujemanje);
   res.render('pregledUjemanja', {ocenaUjemanja:ujemanje, entiteta1:entiteta1, entiteta2:entiteta2, opis:opis});
});

module.exports = router;