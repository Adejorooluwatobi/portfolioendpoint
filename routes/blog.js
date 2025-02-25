const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Blog = require('../Database/blog'); // Import the Blog model

// Multer setup for handling multiple image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]);

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).send('Multer error');
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).send('Unknown error');
        }

        try {
            const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
            const image = req.files['image'] ? req.files['image'][0].path : '';

            const newBlog = new Blog({
                title: req.body.title,
                content: req.body.content,
                image: image,
                images: images,
                isActive: req.body.isActive
            });

            await newBlog.save();

            res.status(200).send('Blog added successfully!');
        } catch (error) {
            console.error('Error saving new blog:', error);
            res.status(500).send('Error processing the request');
        }
    });
});

// Fetch all Blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ lastUpdatedDate: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Blogs');
    }
});

// Fetch a Blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        res.status(200).json(blog);
    } catch (error) {
        console.error('Error fetching Blog:', error);
        res.status(500).send('Error fetching Blog');
    }
});

// Update a Blog
router.put('/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).send('Multer error: ' + err.message);
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).send('Unknown error: ' + err.message);
        }

        try {
            const blog = await Blog.findById(req.params.id);

            if (!blog) {
                return res.status(404).send('Blog not found');
            }

            // Update blog fields
            blog.title = req.body.title;
            blog.content = req.body.content;
            blog.isActive = req.body.isActive === 'true';

            // Handle image update
            if (req.files && req.files['image']) {
                blog.image = req.files['image'][0].path;
            }

            // Handle multiple images update
            if (req.files && req.files['images']) {
                blog.images = req.files['images'].map(file => file.path);
            }

            // Save the updated blog
            await blog.save();

            res.status(200).send('Blog updated successfully');
        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).send('Error updating blog: ' + error.message);
        }
    });
});

// Disable a Blog
router.put('/:id/disable', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        blog.isActive = false;

        await blog.save();

        res.status(200).send('Blog disabled successfully');
    } catch (error) {
        console.error('Error disabling Blog:', error);
        res.status(500).send('Error disabling Blog');
    }
});

// Enable a Blog
router.put('/:id/enable', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        blog.isActive = true;

        await blog.save();

        res.status(200).send('Blog enabled successfully');
    } catch (error) {
        console.error('Error enabling Blog:', error);
        res.status(500).send('Error enabling Blog');
    }
});

// Delete a Blog
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        res.status(200).json({ message: 'Blog deleted successfully', blog });
    } catch (error) {
        console.error('Error deleting Blog:', error);
        res.status(500).json({ message: 'Unable to delete Blog' });
    }
});

module.exports = router;
