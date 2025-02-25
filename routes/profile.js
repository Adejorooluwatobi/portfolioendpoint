const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Profile = require('../Database/profile');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('Image');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}

// Get Profile

router.get('/', async (req, res) => {
    Profile.find({}, (err, profile) => {
        if(err){
            console.log(err);
        } else {
            res.render('profile', {
                profile: profile
            });
        }
    });
});

// Add Profile
router.post('/', async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('profile', {
                msg: err
            });
        } else {
            if(req.file == undefined){
                res.render('profile', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                const newProfile = new Profile({
                    Image: req.file.filename,
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
                });

                newProfile.save().then(profile => {
                    res.redirect('/profile');
                });
            }
        }
    });
});

router.get('/:id', async (req, res) => {
    Profile.findById(req.params.id, (err, profile) => {
        res.render('profile', {
            profile: profile
        });
    });
});

router.put('/:id', async (req, res) => {
    Profile.findByIdAndUpdate(req.params.id, req.body, (err, profile) => {
        res.render('profile', {
            profile: profiles
        });
    });
}); 

router.delete('/:id', async (req, res) => {
    Profile.findByIdAndRemove(req.params.id, (err, profile) => {
        res.redirect('/profile');
    });
}); 

module.exports = router;