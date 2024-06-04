const express = require('express');
const { deleteOcena, getTheData, saveResultSamoocenitve, getOcena, getOcenaByUserIdAndCategory} = require('../Database/dataService');
const {calculateUjemanje, getOpisUjemanja, getUporabniki} = require('../Database/ujemanjeService');
const {doc, setDoc} = require("firebase/firestore");
const { getFirestoreDB } = require('../Database/firebaseInit');
const router = express.Router();
const {getNextUserId, getUporabnikByID} = require('../Database/userService');
const {getAllCategories} = require('../Database/dataService');

const firestoreDB = getFirestoreDB();

router.get('/', async (req, res) => {
    try {
        // Get the logged-in user
        const prijavljeniUporabnik = await getUporabnikByID(req.session.user.id);

        // Fetch all users, categories, and entity map
        const { uporabnikData, entitetaMap } = await getUporabniki();
        const kategorije = await getAllCategories();

        // Check if the logged-in user has any categories
        const userCategories = kategorije.filter(category => prijavljeniUporabnik[category] && prijavljeniUporabnik[category] !== '0');

        // Filter users with tip=2 and ujemanjeZ=prijavljeniUporabnik
        const filteredUporabniki = uporabnikData.filter(uporabnik => 
            uporabnik.tip === 2 && uporabnik.ujemanjeZ === prijavljeniUporabnik.idUporabnik
        );

        req.session.kategorije = userCategories;

        res.render('zgodovinaUjemanja', { uporabniki: filteredUporabniki, kategorije, entitetaMap, userCategories, prijavljeniUporabnik });
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

router.post('/dodajUporabnika', async (req, res) => {
    const { name, category } = req.body;
    const idPrijavljenog = req.session.user.id;
    const newUserId = await getNextUserId();
    const newUser = {
        idUporabnik: newUserId,
        ime: name,
        ujemanjeZ : idPrijavljenog,
        [category]: 0,
        tip: 2
    };

    console.log(newUser.idUporabnik);   

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
        res.render('izbiraEntiteteUjemanje', { entities: data, category, idUporabnik });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});


//TODO optimizirati jer je predugo
router.get('/rezultat/:entitetaId/:uporabnikID/:kategorija', async(req, res) => {
    try{
        const entitetaID = parseInt(req.params.entitetaId, 10); //id rezultata
        const kategorija = req.params.kategorija; //kategorija rezultata
        const uporabnikID = req.params.uporabnikID; //id uporabnika za katereg je narejena ocenitev
        const prijavljeniUporabnik = await getUporabnikByID(req.session.user.id);
        const ocenaPrijavljenega = await getOcena(prijavljeniUporabnik[kategorija]);
        await saveResultSamoocenitve(uporabnikID, entitetaID, kategorija); //sačuva rez ocenitve za uporabnikID
        req.session.entiteta1 = entitetaID;
        req.session.entiteta2 = ocenaPrijavljenega.idEntiteta;
        const entiteta1 = await getOcena(entitetaID); //pridobi entitio drugog uporabnika
        const ujemanje = await calculateUjemanje(entiteta1.naziv, ocenaPrijavljenega.naziv, uporabnikID); //calculate ujemanje
        req.session.ujemanje = ujemanje;
        res.redirect(`/ujemanje/pregledUjemanja`);
    }catch(error){
        console.log(error);
    }
});

// Route to handle setting session data
router.post('/setSessionData', (req, res) => {
    req.session.entiteta1 = parseInt(req.body.entiteta1, 10);
    req.session.entiteta2 = parseInt(req.body.entiteta2, 10);
    req.session.ujemanje = req.body.ujemanje;
    res.sendStatus(200);
  });
  
  // Existing route to render 'pregledUjemanja'
  router.get('/pregledUjemanja', async (req, res) => {
    try {
      const entiteta1ID = req.session.entiteta1; // Get entity 1 ID from session storage
      const entiteta1 = await getOcena(entiteta1ID);
      const entiteta2ID = req.session.entiteta2; // Get entity 2 object from session storage
      const entiteta2 = await getOcena(entiteta2ID);
      
      const ujemanje = req.session.ujemanje;
      req.session.categoryId = entiteta1ID;
      const kategorije = req.session.kategorije;
      
      const opis = await getOpisUjemanja(ujemanje); // Retrieve description
      
      res.render('pregledUjemanja', { ocenaUjemanja: ujemanje, entiteta1: entiteta1, entiteta2: entiteta2, opis: opis, kategorije:kategorije });
    } catch (error) {
      res.status(500).send('Error retrieving data');
    }
  });

  router.get('/pregledOcenitve/:kategorija', async (req, res) => {
    const ocena = req.session.categoryId;
    if (ocena) {
        const data = await getOcena(ocena);
        res.render('PregledOcenitve', { entity: data });
    } else {
        // Handle missing data
        console.error('Error fetching data:', error);
        res.redirect('/errorPage');
    }
});
  

router.get('/pregledUjemanja/:entiteta1/:idPrijavljenega/:kategorija/:ujemanje', async(req, res) => {
    const entiteta1ID = req.params.entiteta1;
    const ujemanje = req.params.ujemanje;
    const kategorija = req.params.kategorija;
    const idPrijavljenega = parseInt(req.params.idPrijavljenega, 10);

    /*console.log('entiteta 1 naziv: '+entiteta1Naziv);
    console.log('ujemanje: '+ujemanje);
    console.log('kategorija: '+kategorija);
    console.log('idPrijavljenega: '+idPrijavljenega);*/
    const entiteta1 = await getOcena(entiteta1);

    //console.log('entiteta1 '+entiteta1.naziv);
    const entiteta2 = await getOcenaByUserIdAndCategory(idPrijavljenega, kategorija);
    //console.log(entiteta2+'ppppppppp');
    const opis = getOpisUjemanja(ujemanje);

    res.render('pregledUjemanja', {ocenaUjemanja:ujemanje, entiteta1:entiteta1, entiteta2:entiteta2, opis:opis});
});



module.exports = router;