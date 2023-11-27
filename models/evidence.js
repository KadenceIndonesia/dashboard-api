const mongoose = require('mongoose');

const evidenceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  SbjNum: Number,
  idProject: String,
  link: String,
  idPanel: Number,
});

module.exports = mongoose.model('Evidence', evidenceSchema);
