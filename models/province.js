const mongoose = require('mongoose');

const provinceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idProvince: Number,
  idRegion: Number,
  regionName: String,
  idProject: String,
  provinceName: String,
  target: Number,
  mapCode: String
});

module.exports = mongoose.model('Province', provinceSchema);
