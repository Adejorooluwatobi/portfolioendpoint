const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const about = require('../Database/about');

router.get('/', async (req, res) => {
    try {
      const aboutData = await about.findOne({});
      if (aboutData) {
        res.status(200).json({ about: aboutData });
      } else {
        res.status(404).json({ error: 'About data not found' });
      }
    } catch (error) {
      console.error('Error fetching About data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.put('/', async (req, res) => {
    try {
        const { title, content, yearsOfExpert, projectCompleted, HappyClients } = req.body;

        // Update the About content directly using Mongoose
        const updatedAbout = await about.findOneAndUpdate(
            {},
            { title, content, yearsOfExpert, projectCompleted, HappyClients },
            { new: true, upsert: true } // To return the updated document
        );

        if (updatedAbout) {
            res.status(200).json({ message: 'About content updated successfully', about: updatedAbout });
        } else {
            res.status(404).json({ error: 'About data not found' });
        }
    } catch (error) {
        console.error('Error updating About content:', error);
        if (error.code === 'ECONNREFUSED') {
            // Database connection error
            res.status(500).json({ error: 'Unable to connect to the database' });
        } else if (error.name === 'ValidationError') {
            // Data validation error
            res.status(400).json({ error: 'Invalid data provided' });
        } else {
            // Catch-all for other errors
            res.status(500).json({ error: 'An unexpected error occurred while updating the About content' });
        }
    }
});


  module.exports = router;