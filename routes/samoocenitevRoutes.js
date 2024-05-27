const express = require('express');
const { getTheData, getUporabnik, getOcena, getAllCategories, saveResultSamoocenitve, deleteOcena} = require('../Database/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
    let categories = await getAllCategories();
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

router.get('/brisanje', async(req, res) => {
    try{
        const idUporabnik = 1;
        await deleteOcena(idUporabnik);
        res.redirect('samoocenitev');
    }catch(error){
        console.log(error);
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

router.get('/rezultat/:entitetaId', async(req, res) => {
    try{
        const entitetaID = parseInt(req.params.entitetaId, 10);
        const uporabnikID = 1;
        await saveResultSamoocenitve(uporabnikID, entitetaID);
        const data = await getOcena(entitetaID);
        res.render('PregledOcenitve', { entity: data });
    }catch(error){
        console.log(error);
    }
});

module.exports = router;