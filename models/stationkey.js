const mongoose = require('mongoose');

const stationkeySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  stationID: String,
  key: String,
});

module.exports = mongoose.model('Stationkey', stationkeySchema);