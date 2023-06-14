const mongoose = require('mongoose');

const targetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idCity: Number,
  cityName: String,
  idProvince: Number,
  provinceName: String,
  idRegion: Number,
  regionName: String,
  wave: String,
  target: Number
});

module.exports = mongoose.model('Target', targetSchema);