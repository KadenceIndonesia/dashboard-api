const mongoose = require("mongoose")

const wordcloudSchema = mongoose.Schema({
    projectID: String,
    questionID: String,
    sbjNum: Number,
    word: String
})

module.exports = mongoose.model('Wordcloud', wordcloudSchema);