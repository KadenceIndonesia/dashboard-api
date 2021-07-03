const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    projectID: String,
    projectName: String,
    status: Number,
    startDate: Date,
    endDate: Date
})

module.exports = mongoose.model('Project', projectSchema);