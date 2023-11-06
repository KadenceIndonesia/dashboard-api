const mongoose = require('mongoose');

const divisionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idDivision: Number,
  idDirectorate: Number,
  idProject: String,
  division: String,
  target: Number
});

module.exports = mongoose.model('Division', divisionSchema);