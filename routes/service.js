const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Service = require('../Database/service');

// Set Storage Engine  
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

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

// Get All Services
router.get('/', async (req, res) => {
    Service.find({}, (err, services) => {
        if (err) {
            console.log(err);
        } else {
            res.render('services', { services: services });
        }
    });
});

// Add Service
router.post('/', async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('add_service', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('add_service', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                const newService = new Service({
                    image: req.file.filename,
                    title: req.body.title,
                    content: req.body.content
                });

                newService.save((err) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.redirect('/services');
                    }
                });
            }
        }
    });
});

// Update Service
router.put('/:id', async (req, res) => {
    Service.findByIdAndUpdate(req.params.id, req.body, (err, service) => {
        res.redirect('/services/' + req.params.id);
    });
});

// Edit Service
router.get('/:id', async (req, res) => {
    Service.findById(req.params.id, (err, service) => {
        res.render('edit_service', { service: service });
    });
});

// Delete Service
router.delete('/:id', async (req, res) => {
    Service.findById(req.params.id, (err, service) => {
        fs.unlink('./public/uploads/' + service.image, (err) => {
            if (err) {
                console.log(err);
            }
        });

        Service.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/services');
            }
        });
    });
});

module.exports = router;