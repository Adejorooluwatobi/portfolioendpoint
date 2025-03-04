const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../database/Project');

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
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 }); // Sort by newest first
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
      const { title, content } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const newProject = new Project({
        image: req.file.filename,
        title,
        content
      });

      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Update a project
router.put('/:id', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    try {
      const projectId = req.params.id;
      const { title, content } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      // Find the existing project
      const existingProject = await Project.findById(projectId);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Update data
      const updateData = {
        title,
        content
      };

      // If new image was uploaded, update the image field and remove old image
      if (req.file) {
        updateData.image = req.file.filename;
        
        // Delete old image file if it exists
        if (existingProject.image) {
          const oldImagePath = path.join('./uploads/', existingProject.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      // Update the project in the database
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        updateData,
        { new: true }
      );

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Find the project to delete
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete the image file associated with the project
    if (project.image) {
      const imagePath = path.join('./uploads/', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the project from the database
    await Project.findByIdAndDelete(projectId);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;