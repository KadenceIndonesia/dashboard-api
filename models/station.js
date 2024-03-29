const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  key: String,
  stationID: Number,
  stationName: String,
  regID: String,
  region: String,
  province: String,
  city: String,
  district: String,
  village: String,
  agent: String,
  address: String,
  upload: Number,
  uploadPoster: Number
});

module.exports = mongoose.model('Station', stationSchema);