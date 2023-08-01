// sekarang baru khusus untuk propana
const mongoose = require('mongoose');

const rawdataSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sbjNum: Number,
  idProject: String,
  question: String,
  answer: String,
  createDate: mongoose.Schema.Types.Date,
  region: String,
  province: String,
  city: String,
  week: String,
  wave: String,
});

module.exports = mongoose.model('Rawdata', rawdataSchema);
