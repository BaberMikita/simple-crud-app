const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название задачи не может быть пустым!'],
        trim: true,
        minlength: [2, 'Название должно быть минимум из 2 символов'],
        // ВОТ ОНА - НАСТОЯЩАЯ ПРОВЕРКА НА БЭКЕНДЕ
        validate: {
            validator: function (value) {
                const forbiddenWords = ['завтра', 'потом', 'когда-нибудь'];
                return !forbiddenWords.some(word => value.toLowerCase().includes(word));
            },
            message: 'Прокрастинация запрещена! Нельзя использовать слова "завтра", "потом" и т.д.'
        }
    },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

// Хук для большой буквы
taskSchema.pre('save', async function () {
    if (this.isModified('title')) {
        this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
    }
});

module.exports = mongoose.model('Task', taskSchema);