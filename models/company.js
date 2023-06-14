const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idCompany: Number,
  company: String,
  idProject: String,
});

module.exports = mongoose.model('Company', companySchema);
