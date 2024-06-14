const mongoose = require('mongoose');

const routeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: String,
  username: String,
  journey: Object,
  date: Date,
  longitude: Number,
  latituce: Number,
});

module.exports = mongoose.model('Route', routeSchema);
