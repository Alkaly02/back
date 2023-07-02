const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DIR = '../uploads/';

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

const { CoursModel } = require('../models/courModel');

/**
 * @recuperer
 */
router.get('/', (req, res, next) => {
    CoursModel.find().then(data => {
        res.status(200).json({
            message: 'Course list retrieved successfully!',
            cours: data
        });
    });
});

/**
 * @ajouter
 */
router.post('/add', (req, res,) => {
    const { date, heure, salle } = req.body
    console.log({ cours: req.body });
    const cours = new CoursModel({
        date,
        heure,
        salle
    });

    cours
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Cours créé!',
                cours: {
                    _id: result._id,
                    date: result.date,
                    heure: result.heure,
                    salle: result.salle
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

/**
 * @supprimer
 */
router.delete('/delete/:id', (req, res,) => {
    const courdId = req.params.id;

    CoursModel.findByIdAndRemove(courdId)
        .then(deletedReservation => {
            if (deletedReservation) {
                res.status(204).json({
                    message: 'Cours supprime!'
                })
            } else {
                res.sendStatus(404); // Send a not found response
            }
        })
        .catch(error => {
            res.sendStatus(500); // Send an internal server error response
        });
});

/**
 * @mettre_a_jour
 */
router.put('/update/:id', async (req, res) => {
    try {
        const courdId = req.params.id;

        const updatedCoursData = req.body;

        const updatedCours = await CoursModel.findByIdAndUpdate(
            courdId,
            updatedCoursData,
            { new: true }
        );

        if (updatedCours) {
            res.status(200).json(updatedCours);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error occurred while updating reservation:', error);
        res.sendStatus(500);
    }
});

// router.post('/add', upload.single('courFile'), (req, res, next) => {
//     const url = req.protocol + '://' + req.get('host');
//     console.log({ cours: req.body });
//     const cour = new CoursModel({
//         courFiliere: req.body.courFiliere,
//         courName: req.body.courName,
//         courFile: url + '/uploads/' + req.file.filename
//     });

//     cour
//         .save()
//         .then(result => {
//             res.status(201).json({
//                 message: 'Course registered successfully!',
//                 courCreated: {
//                     _id: result._id,
//                     courName: result.courName,
//                     courFile: result.courFile,
//                     courFiliere: result.courFiliere
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


module.exports = router;
