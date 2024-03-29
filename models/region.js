const mongoose = require('mongoose');

const regionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idRegion: Number,
  idProject: String,
  regionName: String,
  regionCode: String,
  target: Number,
  sortCode: Number,
  idPanel: Number,
});

module.exports = mongoose.model('Region', regionSchema);
