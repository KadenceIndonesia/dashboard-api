const mongoose = require('mongoose');

const panelslicesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idPanel: Number,
  mainPanel: Number,
  code: String,
  idProject: String,
});

module.exports = mongoose.model('Panelslices', panelslicesSchema);
