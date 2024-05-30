const express = require('express');
const { getTheData,initializeFBApp, getFirebaseAuth,getFirestoreDB, getUporabnik, getOcena, getAllCategories, saveResultSamoocenitve,saveUserData,deleteUserByEmail,checkIfEmailExistsInDatabase, deleteOcena, signInWithEmailAndPassword, createUserWithEmailAndPassword} = require('../Database/firebase');

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
        res.render('PregledOcenitve', { entity: data });
    } else {
        // Handle missing data
        console.error('Error fetching data:', error);
        res.redirect('/errorPage');
    }
});

router.get('/brisanje/:ocena/:kategorija', async(req, res) => {
    try{
        const kategorija = req.params.kategorija;
        console.log(kategorija);
        const idUporabnik = 1;
        await deleteOcena(idUporabnik, kategorija);
        res.redirect('samoocenitev');
    }catch(error){
        console.log(error);
    }
});

router.get('/izvedbaSamoocenitve/:kategorija', async (req, res) => {
    const category = req.params.kategorija;
    const uporabnik = await getUporabnik(1);  // Modify to use the logged-in user's ID
    console.log(uporabnik[category] + 'hhhhhhhh');
    //const ocena = getocenaByCategory(category);
    // If user does not have an entiteta, redirect to the selection page
    if (uporabnik[category] == 0 || !uporabnik[category]) {
        res.redirect('/samoocenitev/izbiraEntitete/' + category);
    } else {
        // Otherwise, redirect to the review page
        //req.session.category = category;
        console.log('lllllll'+uporabnik[category])
        req.session.categoryId = uporabnik[category];
        res.redirect('/samoocenitev/pregledOcenitve/'+category);
        //res.redirect(`/samoocenitev/pregledOcenitve/${uporabnik[category]}/${category}`);
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

router.get('/rezultat/:entitetaId/:kategorija', async(req, res) => {
    try{
        const entitetaID = parseInt(req.params.entitetaId, 10);
        const kategorija = req.params.kategorija
        const uporabnikID = 1;//req.session.user.id;
        await saveResultSamoocenitve(uporabnikID, entitetaID, kategorija);
        //const data = await getOcena(entitetaID);
        /*const uporabnik = getUporabnik(uporabnikID);
        console.log(uporabnik[kategorija]);*/
        req.session.categoryId = entitetaID;
        res.redirect(`/samoocenitev/pregledOcenitve/${kategorija}`);
    }catch(error){
        console.log(error);
    }
});


router.get('/ekran', async(req, res) => {
    try{
        res.render('prijava');
    }catch(error){
        console.log(error);
    }
});

// Registration route
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const emailExists = await checkIfEmailExistsInDatabase(email);
        if (emailExists) {
            return res.status(400).send({ error: 'Email is already in use in the database. Please try a different email.' });
        }

        await deleteUserByEmail(email);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore using the new function
        await saveUserData(user, username);

        res.status(201).send({ message: 'User registered successfully!', user: user.uid });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        res.status(200).send({ message: 'User logged in successfully!', user: user.uid });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;