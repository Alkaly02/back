const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    valid: {
        type: Number,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Etudiant Schema
const EtudiantSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    cne: {
        type: String,
        required: true
    },
    filliere: {
        type: String,
        required: true
    }
});
const UserModel = mongoose.model("User", UserSchema);
const Etudiant = mongoose.model("Etudiant", EtudiantSchema)
// const UserModel = mongoose.model('User', userSchema)
module.exports = { UserModel, Etudiant }
