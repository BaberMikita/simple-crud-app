const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Ищем пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        // 2. Сравниваем введенный пароль с захешированным паролем в базе
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        // В будущем тут можно генерировать JWT токен
        res.status(200).json({
            message: 'Успешный вход',
            user: {
                _id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Ошибка при логине:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Генерируем "соль" (случайную строку для усиления шифрования)
        const salt = await bcrypt.genSalt(10);
        // 2. Хешируем пароль вместе с солью
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword // Сохраняем именно хеш, а не обычный пароль!
        });
        await newUser.save();

        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: {
                _id: newUser._id,
                email: newUser.email
                // Пароль возвращать клиенту не нужно в целях безопасности
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

module.exports = router;