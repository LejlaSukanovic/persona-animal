const express = require('express');
const path = require('path');
const { initializeFBApp } = require('./Database/firebaseInit');
const samoocenitevRoutes = require('./routes/samoocenitevRoutes');
const ujemanjeRoutes = require('./routes/ujemanjeRoutes');
const prijavaRoutes = require('./routes/prijavaRoutes');
const session = require('express-session');
const crypto = require('crypto');
const app = express();

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

app.use('/samoocenitev',isAuthenticated, samoocenitevRoutes);
app.use('/ujemanje',isAuthenticated, ujemanjeRoutes);
app.use('/', prijavaRoutes);
