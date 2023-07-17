const mongoose = require('mongoose');

const loggerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId,
  project: String,
  email: String,
  createdDate: Date,
  createdTime: Date,
  action: String,
});

module.exports = mongoose.model('Loggers', loggerSchema);
