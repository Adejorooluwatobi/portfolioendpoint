const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../Database/category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ LastUpdatedDate: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const newCategory = new Category({
      title,
      content,
      LastUpdatedDate: new Date(),
      IsActive: true
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { title, content, LastUpdatedDate: new Date() },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Enable/Disable a category
router.put('/:id/:status', async (req, res) => {
  try {
    const isActive = req.params.status === 'enable';
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { IsActive: isActive, LastUpdatedDate: new Date() },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: `Category ${isActive ? 'enabled' : 'disabled'} successfully`, category });
  } catch (error) {
    console.error('Error updating category status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
