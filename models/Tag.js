const { Schema, model } = require('mongoose')

const tagSchema = new Schema({
    name: {type: String, require: true, unique: true},
    index: {type: Number, unique: true},
    type: {type: String, require: true, default: 'неизвестный тип'},
    university: {type: String, require: true}
})

module.exports = model('tags', tagSchema)