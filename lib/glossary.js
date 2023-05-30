global.A6 = function (code) {
  var data = [
    'Pangkalan aktif/ beroperasi ',
    'Pangkalan tidak aktif (tutup permanen ',
    'Pangkalan tidak dapat ditemukan ',
    'Pangkalan pindah alamat ',
    'Pangkalan sedang tutup (hanya tutup sementara/tutup saat kunjungan saja',
  ];
  return data[code - 1];
};

global.A7 = function (code) {
  var data = [
    'Ya, saya sendiri pemiliknya ',
    'Pemilik sedang tidak ada disini tapi saya bertugas dan bertanggung jawab disini sehari-hari dan tahu menahu tentang transaksi jual beli LPG 3KG ',
    'Pemilik dan orang yang bertanggungawab sedang tidak ada saat ini',
  ];
  return data[code - 1];
};

global.A113 = function (code) {
  var data = [
    'Ya',
    'Tidak, tidak ada alat yang bisa mengakses email dan website subsidi tepat LPG MyPertamina',
  ];
  return data[code - 1];
};

global.A114 = function (code) {
  var data = ['Smartphone', 'Tablet', 'PC', 'Laptop', 'Lainnya'];
  return data[code - 1];
};

global.A115 = function (code) {
  var data = ['Android', 'Ios', 'Lainnya'];
  return data[code - 1];
};

global.A38 = function (code) {
  var data = [
    'Pemilik',
    'Yang bertugas dan bertanggung jaawab disini sehari-hari',
    'Anak atau saudara pemilik pangkalan',
  ];
  return data[code - 1];
};

global.A12 = function (code) {
  var data = [
    'Belum boarding – Pangkalan yang belum terverifikasi di website subsidi tepat LPG MyPertamina',
    'On Boarding TAPI belum bertransaksi - Pangkalan yang sudah terverifikasi di website Subsidi Tepat LPG MyPertamina namun belum pernah melakukan transaksi',
    'On Boarding TAPI transaksi kecil - Pangkalan yang sudah terverifikasi di website Subsidi Tepat LPG MyPertamina namun frekuensi transaksi baru sedikit',
    'On Boarding transaksi normal - Pangkalan yang sudah terverifikasi di website Subsidi Tepat LPG MyPertamina dan melakukan transaksi secara berkala (sering)/ normal',
  ];
  return data[code - 1];
};

global.A13 = function (code) {
  var data = ['Ya', 'Tidak', 'Lupa Alamat email'];
  return data[code - 1];
};

global.A14 = function (code) {
  var result = [];
  var data = [
    'Tidak Mengerti Proses Verifikasi',
    'Tidak Mengetahui Program Ini',
    'Sulit Mengakses Email/Website',
    'Jaringan/Sinyal Buruk',
    'Belum Merasa Membutuhkan Program Ini',
    'Lainnya',
    'Lainnya',
  ];
  for (let i = 0; i < code.length; i++) {
    if (code[i] >= 1) {
      result.push(data[code[i] - 1]);
    }
  }

  return result.toString();
};

global.A18 = function (code) {
  var result = [];
  var data = [
    'Sulit Mengakses Website',
    'Websitenya Tidak Bisa Dikunjungi/ Tidak Bisa Akses',
    'Loadingnya Lama',
    'Jaringan/ Sinyal Buruk',
    'Tampilan Website Yang Membingungkan',
    'Websitenya Susah Untuk Dioperasikan',
    'Belum Merasa Membutuhkan Program Ini',
    'Tidak Mengerti Proses Transaksi Pada Website',
    'Kurang Efisien',
    'Tidak Praktis',
    'Tidak Ada Pengguna LPG Yang Beli LPG Di Tempat Saya',
    'Lainnya',
    'Lainnya',
  ];
  for (let i = 0; i < code.length; i++) {
    if (code[i] >= 1) {
      result.push(data[code[i] - 1]);
    }
  }
  return result.toString();
};

global.A21 = function (code) {
  var result = [];
  var data = [
    'Sulit Mengakses Website',
    'Websitenya Tidak Bisa Dikunjungi',
    'Loadingnya Lama',
    'Jaringan/Sinyal Buruk',
    'Tampilan Website Yang Membingungkan',
    'Websitenya Susah Dioperasikan',
    'Proses Membutuhkan Waktu Yang Lama',
    'Device/ Alat Kurang Memadai',
    'Tidak Tersedia Pilihan Pembayaran Yang Lengkap Seperti Paylater, Gojek, Transfer Antar Bank, Kartu Kredit/ Debit, Dll',
    'Lainnya, Sebutkan…',
    'Lainnya, Sebutkan…',
  ];
  for (let i = 0; i < code.length; i++) {
    if (code[i] >= 1) {
      result.push(data[code[i] - 1]);
    }
  }
  return result.toString();
};

global.A28 = function (code) {
  var data = ['Ya', 'Tidak'];
  return data[code - 1];
};

global.A28B = function (code) {
  var data = ['Ya', 'Tidak'];
  return data[code - 1];
};

global.A31 = function (code) {
  var data = [
    'Berhasil Dibantu (Berhasil On-boarding Sampai Halaman “Selamat Bergabung”)',
    'Tidak Berhasil On Boarding Karena Kesalahan Email/Lupa Email (Masih Menunggu Email Notif Dari Pertamina)',
    'Tidak Berhasil On Boarding Karena Pangkalan Memang Tidak Mau Melakukan Aktivasi',
    'Tidak Berhasil On Boarding Karena Alasan Yang Lain Selain Di Atas',
  ];
  return data[code - 1];
};

global.A50 = function (code) {
  var data = [
    'Berhasil Transaksi',
    'Tidak Berhasil Transaksi Karena Tidak Ada Pelanggan Pada Saat Kunjungan',
    'Tidak Berhasil Karena Alas An Lainnya',
  ];
  return data[code - 1];
};

global.A33 = function (code) {
  var data = [
    'Berhasil Transaksi',
    'Tidak Berhasil Transaksi Karena Tidak Ada Pelanggan Pada Saat Kunjungan',
    'Tidak Berhasil Transaksi Karena Alas An Lainnya',
  ];
  return data[code - 1];
};

global.A19 = function (code) {
  var data = [
    'Sulit Mengakses Website',
    'Websitenya Tidak Bisa Dikunjungi',
    'Loadingnya Lama',
    'Jaringan/Sinyal Buruk',
    'Tampilan Website Yang Membingungkan',
    'Websitenya Susah Dioperasikan',
    'Belum Merasa Membutuhkan Program Ini',
    'Tidak Mengerti Proses Transaksi Pada Website',
    'Kurang Efisien',
    'Tidak Praktis',
    'Sedikit Pengguna LPG Yang Beli LPG Di Tempat Saya',
    'Lainnya, Sebutkan…',
    'Lainnya, Sebutkan…',
  ];
  return data[code - 1];
};

global.A20 = function (code) {
  var data = ['Ya', 'Tidak'];
  return data[code - 1];
};

global.A35 = function (code) {
  var data = ['Ya', 'Tidak'];
  return data[code - 1];
};

global.A36 = function (code) {
  var data = ['Ya', 'Tidak'];
  return data[code - 1];
};

global.A37 = function (code) {
  var data = ['Ya', 'Tidak'];
  return data[code - 1];
};
