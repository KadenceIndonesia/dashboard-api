const mongoose = require('mongoose');

const evidenceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  SbjNum: Number,
  idProject: String,
  link: String,
});

module.exports = mongoose.model('Evidence', evidenceSchema);
