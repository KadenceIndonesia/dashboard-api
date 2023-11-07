// sekarang baru khusus untuk propana
const mongoose = require('mongoose');

const full2rawdataSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sbjNum: Number,
  SbjNum: Number,
  idProject: String,
  KID_Pangkalan: String,
  KID_KEPO: String,
  WEEK: String,
  createDate: mongoose.Schema.Types.Date,
  WAVE: String,
  A1: String,
  A2: String,
  A3: String,
  KECAMATAN: String,
  KELURAHAN: String,
  S0: String,
  NAMAPANGKALAN: String,
  P0: String,
  A6: String,
  A7: String,
  A113: String,
  A114: String,
  A12: String,
  A13: String,
  A31: String,
  A31b_1: String,
  A31b_2: String,
  A31b_3: String,
  A31b_4: String,
  A31b_5: String,
  A31b_6: String,
  A31b_7: String,
  A31b_8: String,
  A31b_9: String,
  A31b_10: String,
  A31b_11: String,
  A31b_12: String,
  A31b_13: String,
  A31b_14: String,
  A31b_15: String,
  A50: String,
  A18_1: String,
  A18_2: String,
  A18_3: String,
  A18_4: String,
  A18_5: String,
  A18_6: String,
  A18_7: String,
  A18_8: String,
  A18_9: String,
  A18_10: String,
  A18_11: String,
  A18_12: String,
  A18_13: String,
  A18_14: String,
  A18_15: String,
  A18_16: String,
  A18_17: String,
  A18_18: String,
  A18_19: String,
  A18_20: String,
  A18_21: String,
  A18_22: String,
  A18_23: String,
  A18_24: String,
  A18_25: String,
  A18_26: String,
  A18_27: String,
  A33: String,
  A33b_1: String,
  A33b_2: String,
  A33b_3: String,
  A33b_4: String,
  A33b_5: String,
  A33b_6: String,
  A33b_7: String,
  A33b_8: String,
  A33b_9: String,
  A33b_10: String,
  A33b_11: String,
  A33b_12: String,
  A20: String,
  A21_1: String,
  A21_2: String,
  A21_3: String,
  A21_4: String,
  A21_5: String,
  A21_6: String,
  A21_7: String,
  A21_8: String,
  A21_9: String,
  A21_10: String,
  A21_11: String,
  A21_12: String,
  A21_13: String,
  A21_14: String,
  A21_15: String,
  A21_16: String,
  A21_17: String,
  A21_18: String,
  A21_19: String,
  A35: String,
  A36: String,
  A37: String,
  PANEL: String,
  KOTA: String,
  REGION: String,
  Nama_Responden: String,
  ID_Responden: String
});

module.exports = mongoose.model('Full2rawdata', full2rawdataSchema);
