const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


router.post('/login', async (req, res) => {
    try {
        res.send('Login');
        const { email, password } = req.body;

        const newUser = new User({
            email,
            password
        });
        await newUser.save();
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: {
                _id: newUser._id,
                email: newUser.email,
                password: newUser.password
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }
        else {
            console.error('Ошибка при регистрации:', err);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
});

router.post('/register', (req, res) => {
    res.send('Register');
});

module.exports = router;