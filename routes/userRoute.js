const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { UserModel } = require('../models/userModel');

const router = express.Router()
// users.use(cors());
process.env.SECRET_KEY = 'secret';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}


// API: Inscription (POST)
router.post('/register', async (req, res) => {
    const today = new Date();
    const { fullName, email, password } = req.body;
    const userData = {
        fullName: fullName,
        email: email,
        password: password,
        created_at: today
    };

    const findUser = await UserModel.find({ email })
    if (findUser.length) {
        res.status(402).send({ error: "L'utilisateur exist déja" })
        return
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)

    try {
        const createdUser = await UserModel.create({ ...userData, password: hashedPassword })
        res.status(200).json({
            success: true,
            message: "Utilisateur créé",
            // token: generateToken(createdUser._id)
        })
    }
    catch (err) {
        res.status(400).json(err)
    }
});

// API: Connexion (POST)
router.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user = await UserModel.find({ email })

    if (user.length) {
        // check if the given password matches with user password in database
        bcrypt.compare(password, user[0].password, function (err, result) {
            if (!result) {
                res.status(400).json({ error: "Utilisateur introuvable" })
                return
            }
            delete user[0].password
            res.status(200).json({
                user: {
                    _id: user[0]._id,
                    fullName: user[0].fullName,
                    email: user[0].email
                },
                token: generateToken(user[0]._id)
            })
        });
    }
    else {
        res.status(400).json({ error: "L'utilisateur n'existe pas" })
    }
});

// API: Profil (GET)
router.get('/profile', (req, res) => {
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

// API: Mise � jour utilisateur (PUT)
router.put('/:userId', (req, res) => {
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

// API: R�cup�rer tous les utilisateurs (GET)
router.get('/Allusers', async (req, res) => {
    console.log('All users');
    // User.find({ valid: { $exists: false } }, (err, users) => {
    //     if (err) {
    //         console.log('error from all users :', err);
    //         res.send(err);
    //     } else {
    //         console.log('response from all users :', users);
    //         res.json(users);
    //     }
    // });
    const users = await User.find({})
    res.json(users);
});

// API: Valider un utilisateur (PUT)
router.put('/valid/:userId', (req, res) => {
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

module.exports = router;
