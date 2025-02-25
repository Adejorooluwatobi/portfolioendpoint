const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Award = require('../Database/award');
const multer = require('multer');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create a new award
router.post('/', upload.single('image'), async (req, res) => {
    // console.log('POST /award route hit');
    // console.log('Request body:', req.body);
    // console.log('File:', req.file);

    try {
        const { title, position, ViewProject } = req.body;

        // console.log('Extracted data:', { title, position, ViewProject });

        // Check if required fields are present
        if (!title || !position || !ViewProject) {
            console.log('Missing required fields');
            return res.status(400).send('Missing required fields');
        }

        const newAward = new Award({
            title,
            position,
            ViewProject,
            image: req.file ? req.file.path : null
        });

        // console.log('New award object:', newAward);
        newAward.LastUpdatedDate = Date.now();  // Update LastUpdatedDate
        await newAward.save();
        // console.log('Award saved successfully');
        res.status(200).json({ message: 'Award created successfully', award: newAward });
    } catch (error) {
        console.error('Error creating award:', error);
        res.status(500).send('Error processing the request: ' + error.message);
    }
});

// Get all awards
router.get('/', async (req, res) => {
    try {
        const awards = await Award.find();
        res.status(200).json(awards);
    } catch (error) {
        console.error('Error fetching awards:', error);
        res.status(500).send('Error processing the request: ' + error.message);
    }
});

// Get a specific award
router.get('/:id', async (req, res) => {
    try {
        const award = await Award.findById(req.params.id);
        if (!award) {
            console.log('Award not found');
            return res.status(404).send('Award not found');
        }
        res.status(200).json(award);
    } catch (error) {
        console.error('Error fetching award:', error);
        res.status(500).send('Error processing the request: ' + error.message);
    }
});

// Update a specific award
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, position, ViewProject } = req.body;

        // Check if required fields are present
        if (!title || !position || !ViewProject) {
            console.log('Missing required fields');
            return res.status(400).send('Missing required fields');
        }

        const award = await Award.findById(req.params.id);
        if (!award) {
            console.log('Award not found');
            return res.status(404).send('Award not found');
        }

        award.title = title;
        award.position = position;
        award.ViewProject = ViewProject;
        award.image = req.file ? req.file.path : award.image;
        award.LastUpdatedDate = Date.now();  // Update LastUpdatedDate
        await award.save();
        res.status(200).json({ message: 'Award updated successfully', award });
    } catch (error) {
        console.error('Error updating award:', error);
        res.status(500).send('Error processing the request: ' + error.message);
    }
});

// Delete a specific award
router.delete('/:id', async (req, res) => {
    try {
        const award = await Award.findById(req.params.id);
        if (!award) {
            console.log('Award not found');
            return res.status(404).send('Award not found');
        }

        await award.remove();
        res.status(200).json({ message: 'Award deleted successfully' });
    } catch (error) {
        console.error('Error deleting award:', error);
        res.status(500).send('Error processing the request: ' + error.message);
    }
});

module.exports = router;