const mongoose = require('mongoose');

const sensusSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  mainBranch: String,
  outlet: String,
  address: String,
  city: String,
  province: String,
  mapCode: String,
  area: String,
  kanwil: String,
  product: Array,
  emas: Number,
  kendaraan: Number,
  elektronik: Number,
  cicilEmaas: Number,
  tabunganEmas: Number,
  barangMewah: Number,
  lat: Number,
  long: Number,
  idProject: String,
});

module.exports = mongoose.model('Sensus', sensusSchema);
