const mongoose = require('mongoose');

const regionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idRegion: Number,
  idProject: String,
  regionName: String,
});

module.exports = mongoose.model('Region', regionSchema);
