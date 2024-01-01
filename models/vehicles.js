const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  number: String,
  SbjNum: Number,
  province: String,
  city: String,
  type: String,
  upload: Number,
  idProject: String,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
