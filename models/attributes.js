const mongoose = require("mongoose")

const attributeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    projectID: String,
    questionID: String,
    type: String,
    attribute: Array,
    loopLabel: Array
})

module.exports = mongoose.model('Attribute', attributeSchema);