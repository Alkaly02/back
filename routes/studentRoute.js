const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const students = express.Router();
students.use(cors());
'use strict';

const Student = require('../models/studentModel');

// Configuration du stockage pour les fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).array('file');
// Fin de la configuration des fichiers

// API : Ajouter un étudiant (POST)
students.post('/addStudent', (req, res) => {
    Student.findOne({ cne: req.body.cne })
        .then(student => {
            if (!student) {
                const newStudent = new Student({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    cne: req.body.cne,
                    filiere: req.body.filiere
                });
                Student.create(newStudent);
                res.json({ message: 'Student created' });
            } else {
                res.json({ error: 'Student already exists' });
            }
        });
});

// API : Récupérer tous les étudiants (GET)
students.get('/Allstudents', (req, res) => {
    Student.find({}, (err, students) => {
        if (err) {
            res.send(err);
        } else {
            res.json(students);
        }
    });
});

// API : Récupérer un étudiant par son ID (GET)
students.get('/:studentId', (req, res) => {
    Student.findById(req.params.studentId, (err, student) => {
        if (err) {
            res.send(err);
        } else {
            res.json(student);
        }
    });
});

// API : Mettre à jour un étudiant (PUT)
students.put('/:studentId', (req, res) => {
    Student.findOneAndUpdate(
        { _id: req.params.studentId },
        req.body,
        { new: true },
        (err, student) => {
            if (err) {
                res.send(err);
            } else {
                res.json(student);
            }
        }
    );
});

// API : Supprimer un étudiant (DELETE)
students.delete('/:studentId', (req, res) => {
    Student.findOneAndDelete({ _id: req.params.studentId }, (err, student) => {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: 'Student has been deleted' });
        }
    });
});

// API : Upload de fichiers (POST)
students.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).send(req.file);
    });
});

module.exports = students;
