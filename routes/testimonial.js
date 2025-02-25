const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose
const Testimonial = require('../Database/testimonial'); // Import the Testimonial model


router.post('/', async (req, res) => {
    try {
        const { name, position, content } = req.body;

        const newTestimonial = new Testimonial({
            name: name,
            position: position,
            content: content
        });

        await newTestimonial.save();

        res.status(200).json({ message: 'Testimonial added successfully', testimonial: newTestimonial });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        res.status(500).json({ error: 'Failed to add testimonial' });
    }
});

// GET Endpoint: Fetch all testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

// GET Endpoint: Fetch a testimonial by ID
router.get('/:id', async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const testimonial = await Testimonial.findById(testimonialId);

        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        res.status(200).json(testimonial);
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ error: 'Failed to fetch testimonial' });
    }
});

// DELETE Endpoint: Delete a testimonial by ID
router.delete('/:id', async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const deletedTestimonial = await Testimonial.findByIdAndDelete(testimonialId);

        if (!deletedTestimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        res.status(200).json({ message: 'Testimonial deleted successfully', deletedTestimonial });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});

// PUT Endpoint: Update a testimonial by ID
router.put('/:id', async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const { name, position, content } = req.body;

        // Check if the testimonial exists
        const existingTestimonial = await Testimonial.findById(testimonialId);
        if (!existingTestimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        // Update the testimonial fields
        existingTestimonial.name = name;
        existingTestimonial.position = position;
        existingTestimonial.content = content;

        // Save the updated testimonial
        await existingTestimonial.save();

        res.status(200).json({ message: 'Testimonial updated successfully', testimonial: existingTestimonial });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Failed to update testimonial' });
    }
});

module.exports = router;