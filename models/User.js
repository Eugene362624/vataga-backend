const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    index: {type: Number, unique: true},
    userName: {type: String, required: true},
    userSurname: {type: String, required: true},
    userEmail: {type: String, unique: true, required: true},
    userPassword: {type: String, required: true},
    isPrivate: {type: Boolean, default: false},
    bonusBalance: {type: Number, default: 0},
    vatBalance: {type: Number, default: 0},
    university: {type: String, default: 'неизвестного вуза'},
    tags: {type: Array, default: "отсутствуют"},
    answers: {type: Array, default: "Пользователь еще не отвечал на вопросы"},
    questions: {type: Array, default: "Пользователь еще не задавал вопросов"},
    role: {type: String, default: "Обычный пользователь"}
})

module.exports = model('users', userSchema)