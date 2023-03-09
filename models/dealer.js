const mongoose = require('mongoose');

const dealerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idDealer: Number,
  idCity: Number,
  idProject: String,
  dealerName: String,
});

module.exports = mongoose.model('Dealer', dealerSchema);