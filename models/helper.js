const mongoose = require('mongoose');

const helperSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idCity: Number,
  cityName: String,
  idProvince: Number,
  provinceName: String,
  idRegion: Number,
  regionName: String,
  wave: String,
  total: Number
});

module.exports = mongoose.model('Helper', helperSchema);