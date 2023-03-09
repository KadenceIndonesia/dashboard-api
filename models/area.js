const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idArea: Number,
  idRegion: Number,
  idProject: String,
  areaName: String,
});

module.exports = mongoose.model('Area', areaSchema);