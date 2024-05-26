const express = require('express');
const path = require('path');
const { initializeFBApp, uploadProcessedData, getTheData, getUporabnik, getOcena } = require('./Database/firebase');
const { render } = require('ejs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

initializeFBApp();

app.get('/', async (req, res) => {
    try {
        const data = await getTheData();
        res.render('home', { entities: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/samoocenitev', (req, res) => {
    let categories = ['zivali', 'barve'];
    res.render('samoocenitev', { categories });
});

app.get('/pregledOcenitve', async (req, res) => {
    try {
        const data = await getTheData();
        res.render('home', { entities: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/izvedbaSamoocenitve/:kategorija', async (req, res) => {
    const category = req.params.kategorija;
    const uporabnik = await getUporabnik(1/**proslijediti id od prijavljenog uporabnika*/);

    //ako uporabnik nema ocjenu se posalje na test (izbiraEntitete)
    if(uporabnik.entiteta==0){
        /*const data = await getTheData(); //dodati u get the data da se dobiju entitete na osnovu neke kategorije
        res.render('IzbiraEntitete', { entities: data });*/
        res.redirect('/izbiraEntitete/'+category);
    } else {
        /*const ocena = await getOcena(uporabnik.entiteta);
        res.render('PregledOcenitve', {entiteta:ocena});*/
        res.redirect('/pregledOcenitve/'+uporabnik.entiteta);
    }
    console.log(uporabnik);

});

app.get('/izbiraEntitete/:kategorija', async (req, res) => {
    try {
        const category = req.params.kategorija;
        const data = await getTheData(category); //dodati u get the data da se dobiju entitete na osnovu neke kategorije
        res.render('IzbiraEntitete', { entities: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});
