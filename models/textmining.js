const mongoose = require("mongoose")

const textminingSchema = mongoose.Schema({
    projectID: String,
    questionID: String,
    word: String,
    count: Number
})

module.exports = mongoose.model('Textmining', textminingSchema);