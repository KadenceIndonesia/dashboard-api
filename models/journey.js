const mongoose = require('mongoose');
require('dotenv').config();
const dbConn = mongoose.createConnection(process.env.MONGODB_URI_SHOKO);
// const { shoko } = require('../config/db'); // Sesuaikan dengan path ke file db.js

// const Schema = shoko.Schema;

const journeySchema = new dbConn.Schema({
  _id: String,
  createdAt: Date,
  updatedAt: Date,
  user: String,
  isFinish: Boolean,
  startDate: Date,
  startGps: Object,
  routes: Array,
});

const SchemaModelDb2 = shoko.model('Journey', journeySchema);

module.exports = SchemaModelDb2;
