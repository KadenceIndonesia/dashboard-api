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
  score: Number,
  quarter: Number,
  brand: String,
});

module.exports = mongoose.model('Touchpointscore', touchpointscoreSchema);
