const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Consultation = require('../Database/consultation');

// Create Consultation
router.post('/create', async (req, res) => {
    try {
        const { name, phoneNumber, subject, budget, email, comment } = req.body;
        const timestamp = new Date(); // Get current timestamp
        const consultation = new Consultation({ name, phoneNumber, subject, budget, email, comment, timestamp });
        await consultation.save();
        res.status(201).json({ message: 'Consultation created successfully' });
    } catch (err) {
        console.error('Error creating consultation:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// List Consultations
router.get('/list', async (req, res) => {
    try {
        const consultations = await Consultation.find({}, '-createdAt');
        res.json(consultations);
    } catch (err) {
        console.error('Error fetching consultations:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Consultation by ID
router.get('/:id', async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        res.json(consultation);
    } catch (err) {
        console.error('Error fetching consultation by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
