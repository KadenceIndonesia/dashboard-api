const mongoose = require('mongoose');

const touchpointscoreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idDealer: Number,
  dealerName: String,
  idRegion: Number,
  idArea: Number,
  idCity: Number,
  idProject: String,
  code: String,
  label: String,
  score: Number,
  quarter: Number,
  brand: Number,
  group: Number,
});

module.exports = mongoose.model('Touchpointscore', touchpointscoreSchema);
