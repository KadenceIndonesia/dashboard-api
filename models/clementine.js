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
  T1: Array,
  T2: Array,
  T3: Array,
  T4: Array,
  T5: Array,
  T6: Array,
  T7: Array,
  T8: Array,
  T9: Array,
  T10: Array,
  T11: Array,
  T12: String,
  T13: String,
  T14: String,
  T15: Array,
  A4: String,
  A5: String,
});

module.exports = mongoose.model('Clementine', clementineSchema);
