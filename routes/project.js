const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../database/Project');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', async (req, res, next) => {
    Project.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('add_project', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('add_project', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                const newProject = new Project({
                    image: req.file.filename,
                    title: req.body.title,
                    content: req.body.content
                });

                newProject.save((err) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.redirect('/project');
                    }
                });
            }
        }
    });
});

router.get('/:id', async (req, res) => {
    Project.findById(req.params.id, (err, project) => {
        res.render('project', { project: project });
    });
});

router.put('/:id', async (req, res) => {
    Project.findByIdAndUpdate(req.params.id, req.body, (err, project) => {
        res.redirect('/project/' + req.params.id);
    });
});

router.delete('/:id', async (req, res) => {
    Project.findByIdAndRemove(req.params.id, (err, project) => {
        res.redirect('/project');
    });
});

module.exports = router;