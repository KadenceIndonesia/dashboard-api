const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idCity: Number,
  idArea: Number,
  areaName: String,
  idProject: String,
  cityName: String,
  target: Number,
  dataList: Number,
  list: Number
});

module.exports = mongoose.model('City', citySchema);