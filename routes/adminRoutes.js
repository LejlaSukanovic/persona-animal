const express = require('express');
const { getAllEntities, updateEntity, getOcena, addNewEntity, getAllCategories, addUjemanje, getUjemanja } = require('../Database/dataService');
const { initializeFBApp, getFirebaseAuth, getFirestoreDB } = require("../Database/firebaseInit");

initializeFBApp();

const router = express.Router();
const firestoreDB = getFirestoreDB();
const auth = getFirebaseAuth();

router.get('/', async (req, res) => {
    try {
        const entities = await getAllEntities();  
        res.render('admin', { entities });  
    } catch (error) {
        console.error('Failed to fetch entities:', error);
        res.status(500).send("Error fetching entities");
    }
});

router.get('/edit/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data = await getOcena(id);
    if (!data) {
        return res.status(404).send('Entity not found');
    }

    // Fetch ujemanja
    const ujemanja = await getUjemanja(data.naziv);
    data.ujemanja = ujemanja;

    res.render('edit_entity', { entity: data });
});

router.post('/update/:id', async (req, res) => {
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
            if (Array.isArray(req.body.ujemanjeEntity) && Array.isArray(req.body.ocenaUjemanja)) {
                for (let i = 0; i < req.body.ujemanjeEntity.length; i++) {
                    const ujemanjeEntity = req.body.ujemanjeEntity[i];
                    const ocenaUjemanja = parseInt(req.body.ocenaUjemanja[i], 10);
                    const ujemanjeData = { ocena_ujemanja: ocenaUjemanja };

                    const ujemanjeResult = await addUjemanje(data.naziv, ujemanjeEntity, ujemanjeData);
                    if (!ujemanjeResult.success) {
                        console.error('Failed to update compatibility:', ujemanjeResult.message);
                    }
                }
            }
            res.redirect('/admin');
        } else {
            res.status(500).send(result.message);
        }
    } catch (error) {
        res.status(500).send("An error occurred while updating the entity.");
    }
});

router.get('/add-entity', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('add_entity', { categories });
    } catch (error) {
        console.error('Error fetching data for form:', error);
        res.status(500).send('Unable to load the form to add a new entity.');
    }
});

router.post('/add-entity', async (req, res) => {
    const { naziv, opis, negLastnosti, pozLastnosti, existingCategory, newCategory, ujemanjeEntity, ocenaUjemanja } = req.body;
    const kategorija = newCategory || existingCategory; // Use new category if provided, otherwise existing

    const data = { naziv, kategorija, opis, negLastnosti, pozLastnosti };

    try {
        const addResult = await addNewEntity(data);
        if (addResult.success) {
            if (Array.isArray(ujemanjeEntity) && Array.isArray(ocenaUjemanja)) {
                for (let i = 0; i < ujemanjeEntity.length; i++) {
                    const ujemanjeData = { ocena_ujemanja: parseInt(ocenaUjemanja[i], 10) };
                    const ujemanjeResult = await addUjemanje(naziv, ujemanjeEntity[i], ujemanjeData);
                    if (!ujemanjeResult.success) {
                        console.error('Failed to add compatibility:', ujemanjeResult.message);
                    }
                }
            }
            res.redirect('/admin');
        } else {
            res.status(400).send(addResult.message);
        }
    } catch (error) {
        res.status(500).send('An error occurred while adding the entity or compatibility.');
    }
});

module.exports = router;
