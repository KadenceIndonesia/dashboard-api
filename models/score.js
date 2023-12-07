const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idProject: String,
  country: String,
  region: String,
  dealer: String,
  channel: String,
  score: Number,
  logo: Number,
  typography: Number,
  color: Number,
  imageStyle: Number,
  graphicSystem: Number,
});

module.exports = mongoose.model('Score', scoreSchema);
