const express = require('express');
const path = require('path');
const { initializeFBApp, uploadProcessedData, getTheData } = require('./Database/firebase');

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

app.get('/izbiraEntitete', async (req, res) => {
    try {
        const data = await getTheData();
        res.render('IzbiraEntitete', { entities: data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});
