const mongoose = require("mongoose")

const reportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    projectID: String,
    questionID: String,
    slice: Object,
    version: Array,
    creationDate: Array
})

module.exports = mongoose.model('Report', reportSchema);