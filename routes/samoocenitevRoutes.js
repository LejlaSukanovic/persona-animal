const express = require('express');
const { getTheData, getUporabnik, getOcena } = require('../Database/firebase');

const router = express.Router();

router.get('/', (req, res) => {
    let categories = ['zivali', 'barve'];
    res.render('samoocenitev', { categories });
});

router.get('/pregledOcenitve/:ocena', async (req, res) => {
    try {
        const ocena = parseInt(req.params.ocena, 10);
        const data = await getOcena(ocena);
        res.render('PregledOcenitve', { entity: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

router.get('/izvedbaSamoocenitve/:kategorija', async (req, res) => {
    const category = req.params.kategorija;
    const uporabnik = await getUporabnik(1);  // Modify to use the logged-in user's ID

    // If user does not have an entiteta, redirect to the selection page
    if (uporabnik.entiteta == 0) {
        res.redirect('/samoocenitev/izbiraEntitete/' + category);
    } else {
        // Otherwise, redirect to the review page
        res.redirect('/samoocenitev/pregledOcenitve/' + uporabnik.entiteta);
    }
    console.log(uporabnik);
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

module.exports = router;