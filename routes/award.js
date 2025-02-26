const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Award = require('../Database/award');

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
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Get all awards
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find().sort({ _id: -1 });
    res.status(200).json(awards);
  } catch (error) {
    console.error('Error fetching awards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single award by ID
router.get('/:id', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }
    res.status(200).json(award);
  } catch (error) {
    console.error('Error fetching award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new award
router.post('/', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
      const { title, position, ViewProject } = req.body;
      if (!title || !position || !ViewProject) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newAward = new Award({
        image: req.file.filename,
        title,
        position,
        ViewProject,
        LastUpdatedDate: Date.now()
      });

      const savedAward = await newAward.save();
      res.status(201).json(savedAward);
    } catch (error) {
      console.error('Error creating award:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Update an award
router.put('/:id', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    try {
      const awardId = req.params.id;
      const { title, position, ViewProject } = req.body;
      if (!title || !position || !ViewProject) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const existingAward = await Award.findById(awardId);
      if (!existingAward) {
        return res.status(404).json({ error: 'Award not found' });
      }

      const updateData = { title, position, ViewProject, LastUpdatedDate: Date.now() };
      if (req.file) {
        updateData.image = req.file.filename;
        if (existingAward.image) {
          const oldImagePath = path.join('./uploads/', existingAward.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const updatedAward = await Award.findByIdAndUpdate(awardId, updateData, { new: true });
      res.status(200).json(updatedAward);
    } catch (error) {
      console.error('Error updating award:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Delete an award
router.delete('/:id', async (req, res) => {
  try {
    const awardId = req.params.id;
    const award = await Award.findById(awardId);
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    if (award.image) {
      const imagePath = path.join('./uploads/', award.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Award.findByIdAndDelete(awardId);
    res.status(200).json({ message: 'Award deleted successfully' });
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
