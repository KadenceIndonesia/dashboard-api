const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  projectID: Array,
  username: String,
  email: String,
  password: String,
  status: Number,
  role: String,
  access: [{ idProject: String, data: Array }],
});

module.exports = mongoose.model('User', userSchema);
