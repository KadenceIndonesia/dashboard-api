const mongoose = require('mongoose');

const brandindexSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  serial: Number,
  sbj: Number,
  brand: String,
  current: Number,
  future: Number,
  bei: Number,
  S2a: String,
  S0d: String,
  S1: String,
  S6: String,
});

module.exports = mongoose.model('Brandindex', brandindexSchema);