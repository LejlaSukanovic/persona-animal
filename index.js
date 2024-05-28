const express = require('express');
const path = require('path');
const { initializeFBApp } = require('./Database/firebase');
const { render } = require('ejs');
const samoocenitevRoutes = require('./routes/samoocenitevRoutes');
const ujemanjeRoutes = require('./routes/ujemanjeRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Database', express.static(path.join(__dirname, 'Database')));
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

initializeFBApp();

app.get('/', async (req, res) => {
    res.redirect('/samoocenitev');
});

app.use('/samoocenitev', samoocenitevRoutes);
app.use('/samoocenitev/ujemanje', ujemanjeRoutes);



