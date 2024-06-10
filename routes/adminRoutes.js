const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllEntities, updateEntity, getOcena, addNewEntity, getAllCategories, addUjemanje, getUjemanja, deleteEntity } = require('../Database/dataService');
const { initializeFBApp, getFirebaseAuth, getFirestoreDB } = require("../Database/firebaseInit");
const { uploadImage } = require('../services/fileUploadService');

initializeFBApp();

const router = express.Router();
const firestoreDB = getFirestoreDB();
const auth = getFirebaseAuth();
const upload = multer({ storage: multer.memoryStorage() });


//get the admin page
router.get('/', async (req, res) => {
    try {
        const entities = await getAllEntities();  
        res.render('admin', { entities });  
    } catch (error) {
        console.error('Failed to fetch entities:', error);
        res.status(500).send("Error fetching entities");
    }
});


//get the update entity page
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


//update existing entity
router.post('/update/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data = {
        naziv: req.body.naziv,
        kategorija: req.body.kategorija,
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


//get the add entity page
router.get('/add-entity', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('add_entity', { categories });
    } catch (error) {
        console.error('Error fetching data for form:', error);
        res.status(500).send('Unable to load the form to add a new entity.');
    }
});


//add new entity with image
router.post('/add-entity', upload.single('slika'), async (req, res) => {
    const { naziv, negLastnosti, pozLastnosti, existingCategory, newCategory, ujemanjeEntity, ocenaUjemanja } = req.body;
    const kategorija = newCategory || existingCategory; // Use new category if provided, otherwise existing

    const data = { naziv, kategorija, negLastnosti, pozLastnosti };

    try {
        if (req.file) {
            const uploadResult = await uploadImage(req.file, naziv);
            if (!uploadResult.success) {
                return res.status(500).send('Error uploading image: ' + uploadResult.message);
            }
            data.slika = uploadResult.url;
        }

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
        console.error("Error during entity addition:", error);
        res.status(500).send('An error occurred while adding the entity or compatibility.');
    }
});

//delete entity
router.post('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const deleteResult = await deleteEntity(id);
        if (deleteResult.success) {
            res.redirect('/admin');
        } else {
            res.status(500).send(deleteResult.message);
        }
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send("An error occurred while deleting the entity.");
    }
});

module.exports = router;
