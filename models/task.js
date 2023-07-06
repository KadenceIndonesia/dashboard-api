const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idDealer: Number,
  idProject: String,
  key: String,
  quarter: Number,
});

module.exports = mongoose.model('Task', taskSchema);