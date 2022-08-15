const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    projectID: String,
    projectName: String,
    projectType: String,
    status: Number,
    startDate: Date,
    endDate: Date,
    multiple: Boolean,
    subDirectory: Array,
    topbreak: [
        {
            quest: String,
            label: String
        }
    ]
})

module.exports = mongoose.model('Project', projectSchema);