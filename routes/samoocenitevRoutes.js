const express = require('express');
const { getTheData, getUporabnik, getOcena, getAllCategories, saveResultSamoocenitve, deleteOcena} = require('../Database/firebase');

const router = express.Router();

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
    //const ocena = getocenaByCategory(category);
    // If user does not have an entiteta, redirect to the selection page
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

router.get('/rezultat/:entitetaId/:kategorija', async(req, res) => {
    try{
        const entitetaID = parseInt(req.params.entitetaId, 10);
        const kategorija = req.params.kategorija
        const uporabnikID = 1;
        await saveResultSamoocenitve(uporabnikID, entitetaID, kategorija);
        const data = await getOcena(entitetaID);
        /*const uporabnik = getUporabnik(uporabnikID);
        console.log(uporabnik[kategorija]);*/
        res.redirect(`/samoocenitev/pregledOcenitve/${data.idEntiteta}/${kategorija}`);
    }catch(error){
        console.log(error);
    }
});

module.exports = router;