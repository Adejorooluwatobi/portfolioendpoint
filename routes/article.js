const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const about = require('../Database/article');
const Category = require('../Database/category');
const multer = require('multer');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create a new article
router.post('/', upload.single('image'), async (req, res) => {
    // console.log('POST /article route hit');
    // console.log('Request body:', req.body);
    // console.log('File:', req.file);

    try {
        const { categoryId, title, content, signatory } = req.body;

        // console.log('Extracted data:', { categoryId, title, content, signatory });

        // Check if required fields are present
        if (!categoryId || !title || !content) {
            console.log('Missing required fields');
            return res.status(400).send('Missing required fields');
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            console.log('Category not found');
            return res.status(400).send('Category not found');
        }

        const newArticle = new Article({
            categoryId,
            title,
            signatory,
            image: req.file ? req.file.path : null
        });

        // console.log('New article object:', newArticle);
        newArticle.LastUpdatedDate = Date.now();  // Update LastUpdatedDate
        await newArticle.save();
        // console.log('Article saved successfully');
        res.status(200).json({ message: 'Article created successfully', article: newArticle });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).send('Error processing the request: ' + error.message);
    }
});
// Get all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ updatedAt: -1 }).populate('categoryId');
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Error fetching articles');
    }
});


// Get a specific article by ID
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('categoryId');
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Error fetching article');
    }
});

// Update an article
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { categoryId, title, signatory } = req.body;

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).send('Category not found');
        }

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }

        article.categoryId = categoryId;
        article.title = title;
        article.signatory = signatory;
        if (req.file) {
            article.image = req.file.path;
        }

        await article.save();
        res.status(200).send('Article updated successfully');
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send('Error updating article');
    }
});

// Enable an article
router.put('/:id/enable', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }

        article.isActive = true;
        await article.save();

        res.status(200).send('Article enabled successfully');
    } catch (error) {
        console.error('Error enabling article:', error);
        res.status(500).send('Error enabling article');
    }
});

// Disable an article
router.put('/:id/disable', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }

        article.isActive = false;
        await article.save();

        res.status(200).send('Article disabled successfully');
    } catch (error) {
        console.error('Error disabling article:', error);
        res.status(500).send('Error disabling article');
    }
});

// Delete an article
router.delete('/:id', async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.status(200).json({ message: 'Article deleted successfully', article });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).send('Error deleting article');
    }
});

module.exports = router;
