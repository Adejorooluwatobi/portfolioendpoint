const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Expert = require('../Database/expert');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
}).single('image');

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).send('Multer error');
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).send('Unknown error');
        }

        try {
            const newExpert = new Expert({
                name: req.body.name,
                title: req.body.title,
                Image: req.file.path
            });

            await newExpert.save();

            res.status(200).send('Expert added successfully!');
        } catch (error) {
            console.error('Error saving new expert:', error);
            res.status(500).send('Error processing the request');
        }
    });
});

router.get('/', async (req, res) => {
    try {
        const experts = await Expert.find();

        res.status(200).send(experts);
    } catch (error) {
        console.error('Error fetching experts:', error);
        res.status(500).send('Error processing the request');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);

        res.status(200).send(expert);
    } catch (error) {
        console.error('Error fetching expert:', error);
        res.status(500).send('Error processing the request');
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Expert.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send('Expert updated successfully!');
    } catch (error) {
        console.error('Error updating expert:', error);
        res.status(500).send('Error processing the request');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Expert.findByIdAndDelete(req.params.id);
        res.status(200).send('Expert deleted successfully!');
    } catch (error) {
        console.error('Error deleting expert:', error);
        res.status(500).send('Error processing the request');
    }
});

module.exports = router;