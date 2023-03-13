const mongoose = require('mongoose');

const touchpointgroupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  label: String,
  code: String,
  isParent: Boolean,
  group: Number,
  idProject: String,
});

module.exports = mongoose.model('Touchpointgroup', touchpointgroupSchema);