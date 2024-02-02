const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idProject: String,
  idRespondent: Number,
  date: Date,
  type: String,
  duration: Number,
});

module.exports = mongoose.model('Video', videoSchema);
