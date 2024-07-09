// db.js
const mongoose = require('mongoose');
require('dotenv').config();
// Koneksi ke Database Pertama
const db1URI = process.env.MONGODB_URI;
mongoose.connect(db1URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Koneksi ke Database Kedua
const dbShoko = process.env.MONGODB_URI_SHOKO;
const dbShokoConnection = mongoose.createConnection(dbShoko, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export koneksi untuk digunakan di aplikasi
module.exports = {
  koins: mongoose.connection,
  shoko: dbShokoConnection,
};
