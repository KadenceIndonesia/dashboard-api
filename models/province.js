const mongoose = require('mongoose');

const provinceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idProvince: Number,
  idProject: String,
  provinceName: String,
  target: Number
});

module.exports = mongoose.model('Province', provinceSchema);
