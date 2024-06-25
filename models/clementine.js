const mongoose = require('mongoose');

const clementineSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  S0d: String,
  S1: String,
  S2a: String,
  S6: String,
  S3: String,
  S4: String,
  S5: String,
});

module.exports = mongoose.model('Clementine', clementineSchema);
