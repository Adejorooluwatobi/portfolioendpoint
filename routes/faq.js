const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Faq = require('../Database/Faq');

// create a new FAQ
router.post('/', async (req, res) => {
    try {
        const newFaq = new Faq({
            question: req.body.question,
            answer: req.body.answer
        });

        await newFaq.save();

        res.status(200).send('FAQ added successfully!');
    } catch (error) {
        console.error('Error saving new FAQ:', error);
        res.status(500).send('Error processing the request');
    }
});

router.get('/', async (req, res) => {
    try {
        const faqs = await Faq.find();

        res.status(200).send(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).send('Error processing the request');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);

        res.status(200).send(faq);
    } catch (error) {
        console.error('Error fetching FAQ:', error);
        res.status(500).send('Error processing the request');
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Faq.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send('FAQ updated successfully!');
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).send('Error processing the request');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.status(200).send('FAQ deleted successfully!');
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).send('Error processing the request');
    }
});

module.exports = router;