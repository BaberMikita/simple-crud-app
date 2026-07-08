// файл: routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Импортируем нашу модель из соседней папки

// Обрати внимание: мы убрали '/api/tasks' из каждого пути, 
// потому что мы зададим этот базовый префикс в главном файле.
// Теперь тут просто '/' или '/:id'

// 1. ЧТЕНИЕ ВСЕХ ЗАДАЧ (GET)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Не удалось получить список задач" });
    }
});

// 2. СОЗДАНИЕ (POST)
router.post('/', async (req, res) => {
    try {
        const newTask = await Task.create({
            title: req.body.title,
            isCompleted: req.body.isCompleted
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('POST /tasks error:', error.name, error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: "Ошибка валидации данных",
                details: error.message
            });
        }
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

// 3. ОБНОВЛЕНИЕ (PATCH)
router.patch('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ error: "Задача не найдена" });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при обновлении" });
    }
});

// 4. УДАЛЕНИЕ (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: "Задача не найдена" });
        res.status(200).json({ message: "Задача успешно удалена" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при удалении" });
    }
});

// Экспортируем роутер
module.exports = router;