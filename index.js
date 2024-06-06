const express = require('express');
const path = require('path');
const { initializeFBApp } = require('./Database/firebaseInit');
const samoocenitevRoutes = require('./routes/samoocenitevRoutes');
const ujemanjeRoutes = require('./routes/ujemanjeRoutes');
const prijavaRoutes = require('./routes/prijavaRoutes');
const session = require('express-session');
const crypto = require('crypto');
const app = express();

const { getAllEntities, updateEntity, getOcena, addNewEntity, getAllCategories } = require('./Database/dataService');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Database', express.static(path.join(__dirname, 'Database')));

const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

initializeFBApp();


app.get('/', (req, res) => {
    res.render('prijava');
});

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.id) {
        next();
    } else {
        res.redirect('/');
    }
};


//edit entities routes/////////////////////
app.get('/admin', async (req, res) => {
    try {
        const entities = await getAllEntities();  
        res.render('admin', { entities });  
    } catch (error) {
        console.error('Failed to fetch entities:', error);
        res.status(500).send("Error fetching entities");
    }
});

app.get('/admin/edit/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data = await getOcena(id);
    if (!data) {
        return res.status(404).send('Entity not found');
    }
    res.render('edit_entity', { entity: data });
});

app.post('/admin/update/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data = {
        naziv: req.body.naziv,
        kategorija: req.body.kategorija,
        opis: req.body.opis,
        negLastnosti: req.body.negLastnosti,
        pozLastnosti: req.body.pozLastnosti
    };

    try {
        const result = await updateEntity(id, data);
        if (result.success) {
            res.redirect('/admin');
        } else {
            res.status(500).send(result.message);
        }
    } catch (error) {
        res.status(500).send("An error occurred while updating the entity.");
    }
});

app.get('/admin/add-entity', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('add_entity', { categories });
    } catch (error) {
        res.status(500).send('Failed to load categories.');
    }
});
app.post('/admin/add-entity', async (req, res) => {
    const { naziv, opis, negLastnosti, pozLastnosti } = req.body;
    const kategorija = req.body.newCategory || req.body.existingCategory; // Use new category if provided, otherwise existing

    const data = {
        naziv,
        kategorija,
        opis,
        negLastnosti,
        pozLastnosti
    };

    try {
        const result = await addNewEntity(data);
        if (result.success) {
            res.redirect('/admin');
        } else {
            res.status(400).send(result.message);
        }
    } catch (error) {
        res.status(500).send('An error occurred while adding the entity.');
    }
});




//////////////////////////////////
app.use('/samoocenitev',isAuthenticated, samoocenitevRoutes);
app.use('/ujemanje',isAuthenticated, ujemanjeRoutes);
app.use('/', prijavaRoutes);
app.use((req, res, next) => {
    res.status(404).render('404');
});
