const mongoose = require('mongoose');

const panelSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idPanel: Number,
  panel: String,
  target: Number,
  idDirectorate: Number,
  idDivision: Number,
  idProject: String,
  code: String,
  type: String,
  region: Array,
});

module.exports = mongoose.model('panel', panelSchema);
