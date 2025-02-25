const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../Database/contact'); // Import the Contact model

// Get contact data
router.get('/', async (req, res) => {
  try {
    const contactData = await Contact.findOne();
    if (contactData) {
      res.status(200).json({ contact: contactData });
    } else {
      res.status(404).json({ error: 'Contact data not found' });
    }
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update contact data
router.put('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create the update object
    const updateData = {
      title,
      content
    };

    // Perform upsert update operation
    const updatedContact = await Contact.updateOne({}, updateData, { upsert: true });

    // Send a success response
    res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
  } catch (error) {
    console.error('Error updating contact information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
