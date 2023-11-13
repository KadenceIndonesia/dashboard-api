const mongoose = require('mongoose');

const sliceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  SbjNum: Number,
  idPanel: Number,
  mainPanel: Number,
  code: String,
  idProject: String,
});

module.exports = mongoose.model('Slice', sliceSchema);
