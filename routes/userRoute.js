const express = require('express');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const User = require('../models/userModel');

const users = express.Router();
users.use(cors());
process.env.SECRET_KEY = 'secret';

// API: Inscription (POST)
users.post('/register', (req, res) => {
    const today = new Date();
    const { fullName, email, password, valid } = req.body;
    const userData = {
        fullName: fullName,
        email: email,
        password: password,
        valid: valid,
        created_at: today
    };

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                bcryptjs.hash(password, 10, (err, hash) => {
                    userData.password = hash;
                    User.create(userData)
                        .then(user => {
                            res.json({ status: user.email + ' registered!' });
                        })
                        .catch(err => {
                            res.send('Error: ' + err);
                        });
                });
            } else {
                res.json({ error: 'User already exists' });
            }
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
});

// API: Connexion (POST)
users.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email, valid: { $exists: true } })
        .then(user => {
            if (user && user.valid === 1) {
                if (bcryptjs.compareSync(password, user.password)) {
                    const payload = {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });
                    res.send(token);
                } else {
                    res.json({ error: "User doesn't exist" });
                }
            } else {
                res.json({ error: "User does not exist" });
            }
        });
});

// API: Profil (GET)
users.get('/profile', (req, res) => {
    const token = req.headers['authorization'];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.send('Invalid token');
        } else {
            User.findOne({ id: decoded.id })
                .then(user => {
                    if (user) {
                        res.json(user);
                    } else {
                        res.send('User does not exist');
                    }
                })
                .catch(err => {
                    res.send('Error: ' + err);
                });
        }
    });
});

// API: Mise à jour utilisateur (PUT)
users.put('/:userId', (req, res) => {
    const { userId } = req.params;

    User.findOneAndUpdate(
        { _id: userId },
        req.body,
        { new: true },
        (err, user) => {
            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        }
    );
});

// API: Récupérer tous les utilisateurs (GET)
users.get('/Allusers', (req, res) => {
    User.find({ valid: { $exists: false } }, (err, users) => {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

// API: Valider un utilisateur (PUT)
users.put('/valid/:userId', (req, res) => {
    const { userId } = req.params;

    User.findOneAndUpdate(
        { _id: userId },
        req.body,
        { new: true },
        (err, user) => {
            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        }
    );
});

module.exports = users;
