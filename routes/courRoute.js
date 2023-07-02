const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase();
        cb(null, uuidv4() + '-' + fileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

const Cour = require('../models/courModel');

router.post('/addCour', upload.single('courFile'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const cour = new Cour({
        courFiliere: req.body.courFiliere,
        courName: req.body.courName,
        courFile: url + '/uploads/' + req.file.filename
    });
    cour
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Course registered successfully!',
                courCreated: {
                    _id: result._id,
                    courName: result.courName,
                    courFile: result.courFile,
                    courFiliere: result.courFiliere
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/All', (req, res, next) => {
    Cour.find().then(data => {
        res.status(200).json({
            message: 'Course list retrieved successfully!',
            cours: data
        });
    });
});

module.exports = router;
