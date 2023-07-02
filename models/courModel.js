const mongoose = require('mongoose');

const salleOptions = ['Salle 1', 'Salle 2', 'Salle 3', 'Salle 4', 'Salle 5'];

const CourSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    heure: {
        type: Number,
        required: true,
    },
    salle: {
        type: String,
        required: true,
        enum: salleOptions
    }
});

const CoursModel = mongoose.model('Cour', CourSchema);
module.exports = { CoursModel } 