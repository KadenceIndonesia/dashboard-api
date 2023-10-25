const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  projectID: String,
  branch: String,
  city: String,
  province: String,
  area: String,
  key: String,
  rawdata: Number,
  tags: String,
});

module.exports = mongoose.model('Branch', branchSchema);
