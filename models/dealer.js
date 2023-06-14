const mongoose = require('mongoose');

const dealerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  task: mongoose.Schema.Types.ObjectId,
  idDealer: Number,
  idCity: Number,
  idRegion: Number,
  idArea: Number,
  idProject: String,
  dealerName: String,
  type: String,
  company: String,
  idCompany: Number,
});

module.exports = mongoose.model('Dealer', dealerSchema);
