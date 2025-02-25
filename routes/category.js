const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../Database/category'); // Update the path as necessary

// Create a new category
router.post('/', async (req, res) => {
    try {
        const newCategory = new Category({
            title: req.body.title,
            content: req.body.content,
            LastUpdatedDate: new Date(),
            IsActive: true
        });

        await newCategory.save();

        res.status(200).send('Category added successfully!');
    } catch (error) {
        console.error('Error saving new category:', error);
        res.status(500).send('Error processing the request');
    }
});

// Fetch all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ LastUpdatedDate: -1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching categories');
    }
});

// Fetch a category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching category');
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        category.title = req.body.title;
        category.content = req.body.content;
        category.LastUpdatedDate = new Date();

        await category.save();

        res.status(200).send('Category updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating category');
    }
});

// Disable a category
router.put('/:id/disable', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        category.LastUpdatedDate = new Date();
        category.IsActive = false;

        await category.save();

        res.status(200).send('Category disabled successfully');
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).send('Error updating category');
    }
});

// Enable a category
router.put('/:id/enable', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        category.LastUpdatedDate = new Date();
        category.IsActive = true;

        await category.save();

        res.status(200).send('Category enabled successfully');
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).send('Error updating category');
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.status(200).json({ message: 'Category deleted successfully', category });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: 'Unable to delete category' });
    }
});

module.exports = router;
