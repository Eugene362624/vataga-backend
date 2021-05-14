const { Schema, model } = require('mongoose')

const questionSchema = new Schema({
    title: { type: String, require: true },
    text: { type: String, require: true },
    rate: { type: Number, default: 0 },
    creator: { type: String, require: true },
    subscribers: { type: Array },
    tags: {type: Array},
    timestamp: { type: String },
    index: {type: Number, unique: true},
    answers: [{

        type: Object,
        respondent: { type: String },
        timestamp: { type: Date },
        text: { type: String },
        isBest: { type: Boolean, default: false },
        rate: { type: Number, default: 0 }

    }],
    reports: { type: Number, default: 0 }
})

module.exports = model("questions", questionSchema)