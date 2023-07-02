const mongoose = require('mongoose');

const CourSchema = new mongoose.Schema({
    courFile: {
        type: String
    },
    courName: {
        type: String
    },
    courFiliere: {
        type: String
    }
}, {
    collection: 'cours'
});

module.exports = mongoose.model('Cours', CourSchema);
