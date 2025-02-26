const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Profile = require('../Database/profile');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('Image');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Get Profile - simplified to match about.js pattern
router.get('/', async (req, res) => {
  try {
    const profileData = await Profile.findOne({});
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      res.status(404).json({ error: 'Profile data not found' });
    }
  } catch (error) {
    console.error('Error fetching Profile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Profile - simplified to match about.js pattern
router.put('/', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    try {
      const updateData = {
        Name: req.body.Name,
        content: req.body.content,
        phone: req.body.phone,
        email: req.body.email,
        Link: [
          {
            image: req.body.image,
            url: req.body.url
          }
        ]
      };

      // Add image only if a new file was uploaded
      if (req.file) {
        updateData.Image = req.file.filename;
      }

      // Use findOneAndUpdate with upsert like in about.js
      const updatedProfile = await Profile.findOneAndUpdate(
        {}, 
        updateData,
        { new: true, upsert: true }
      );

      res.status(200).json({ 
        message: 'Profile updated successfully', 
        profile: updatedProfile 
      });
    } catch (error) {
      console.error('Error updating Profile:', error);
      if (error.code === 'ECONNREFUSED') {
        res.status(500).json({ error: 'Unable to connect to the database' });
      } else if (error.name === 'ValidationError') {
        res.status(400).json({ error: 'Invalid data provided' });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred while updating the Profile' });
      }
    }
  });
});

module.exports = router;