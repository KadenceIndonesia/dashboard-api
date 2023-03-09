const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idCity: Number,
  idArea: Number,
  idProject: String,
  cityName: String,
});

module.exports = mongoose.model('City', citySchema);