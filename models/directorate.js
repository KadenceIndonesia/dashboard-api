const mongoose = require('mongoose');

const directorateSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idDirectorate: Number,
  idProject: String,
  directorate: String,
  target: Number
});

module.exports = mongoose.model('Directorate', directorateSchema);