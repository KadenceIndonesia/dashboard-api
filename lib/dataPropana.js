require("./index");
const dataPropana = [
  {
    code: 2,
    kelurahan: "PARIT",
    pangkalan: 12,
    target: 3919,
    target_pangkalan: 326,
    target_pangkalan_percent: 293,
    region: "Region 1",
    regCode: 1,
    kabupaten: "KABUPATEN PASAMAN BARAT",
    kabCode: 16,
  },
  {
    code: 1,
    kelurahan: "TANJUNG SENGKUANG",
    pangkalan: 50,
    target: 2800,
    target_pangkalan: 56,
    target_pangkalan_percent: 50,
    region: "Region 1",
    regCode: 1,
    kabupaten: "KOTA BATAM",
    kabCode: 30,
  },
  {
    code: 3,
    kelurahan: "BELAWAN I",
    pangkalan: 16,
    target: 2467,
    target_pangkalan: 155,
    target_pangkalan_percent: 139,
    region: "Region 1",
    regCode: 1,
    kabupaten: "KOTA MEDAN",
    kabCode: 36,
  },
  {
    code: 5,
    kelurahan: "PRINGSEWU UTARA",
    pangkalan: 15,
    target: 961,
    target_pangkalan: 64,
    target_pangkalan_percent: 58,
    region: "Region 2",
    regCode: 2,
    kabupaten: "KABUPATEN PRINGSEWU",
    kabCode: 19,
  },
  {
    code: 6,
    kelurahan: "DWI WARGA TUNGGAL JAYA",
    pangkalan: 12,
    target: 927,
    target_pangkalan: 64,
    target_pangkalan_percent: 58,
    region: "Region 2",
    regCode: 2,
    kabupaten: "KABUPATEN TULANG BAWANG",
    kabCode: 21,
  },
  {
    code: 7,
    kelurahan: "KOTA BARU",
    pangkalan: 10,
    target: 1631,
    region: "Region 2",
    regCode: 2,
    kabupaten: "KOTA BANDAR LAMPUNG",
    kabCode: 29,
  },
  {
    code: 4,
    kelurahan: "BETUNGAN",
    pangkalan: 17,
    target: 1536,
    region: "Region 2",
    regCode: 2,
    kabupaten: "KOTA BENGKULU",
    kabCode: 32,
  },
  {
    code: 8,
    kelurahan: "SAWAH BARU",
    pangkalan: 20,
    target: 2450,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA TANGERANG SELATAN",
    kabCode: 42,
  },
  {
    code: 9,
    kelurahan: "KEDAUNG KALI ANGKE",
    pangkalan: 15,
    target: 7609,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA JAKARTA BARAT",
    kabCode: 24,
  },
  {
    code: 10,
    kelurahan: "UTAN PANJANG",
    pangkalan: 10,
    target: 6919,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA JAKARTA PUSAT",
    kabCode: 25,
  },
  {
    code: 11,
    kelurahan: "SRENGSENG SAWAH",
    pangkalan: 40,
    target: 9509,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA JAKARTA SELATAN",
    kabCode: 26,
  },
  {
    code: 12,
    kelurahan: "RAWA BADAK UTARA",
    pangkalan: 18,
    target: 7090,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA JAKARTA UTARA",
    kabCode: 27,
  },
  {
    code: 13,
    kelurahan: "JATIMULYA",
    pangkalan: 39,
    target: 6715,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KABUPATEN BEKASI",
    kabCode: 7,
  },
  {
    code: 14,
    kelurahan: "NANGGEWER",
    pangkalan: 15,
    target: 4415,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KABUPATEN BOGOR",
    kabCode: 9,
  },
  {
    code: 15,
    kelurahan: "SAYANG",
    pangkalan: 16,
    target: 5026,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KABUPATEN CIANJUR",
    kabCode: 11,
  },
  {
    code: 16,
    kelurahan: "PABEAN UDIK",
    pangkalan: 11,
    target: 2611,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KABUPATEN INDRAMAYU",
    kabCode: 12,
  },
  {
    code: 17,
    kelurahan: "KARAWANG PAWITAN",
    pangkalan: 19,
    target: 4111,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KABUPATEN KARAWANG",
    kabCode: 14,
  },
  {
    code: 18,
    kelurahan: "MANON JAYA",
    pangkalan: 10,
    target: 724,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KABUPATEN TASIKMALAYA",
    kabCode: 20,
  },
  {
    code: 19,
    kelurahan: "HARAPAN BARU",
    pangkalan: 10,
    target: 2320,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA BEKASI",
    kabCode: 31,
  },
  {
    code: 20,
    kelurahan: "KALIJAGA",
    pangkalan: 30,
    target: 6356,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA CIREBON",
    kabCode: 33,
  },
  {
    code: 21,
    kelurahan: "PONDOK PETIR",
    pangkalan: 12,
    target: 2407,
    region: "Region 3",
    regCode: 3,
    kabupaten: "KOTA DEPOK",
    kabCode: 34,
  },
  {
    code: 22,
    kelurahan: "SAWOJAJAR",
    pangkalan: 15,
    target: 2188,
    region: "Region 4",
    regCode: 4,
    kabupaten: "KABUPATEN BREBES",
    kabCode: 10,
  },
  {
    code: 23,
    kelurahan: "ASEMDOYONG",
    pangkalan: 14,
    target: 2345,
    region: "Region 4",
    regCode: 4,
    kabupaten: "KABUPATEN PEMALANG",
    kabCode: 17,
  },
  {
    code: 24,
    kelurahan: "TANJUNG MAS",
    pangkalan: 59,
    target: 4907,
    region: "Region 4",
    regCode: 4,
    kabupaten: "KOTA SEMARANG",
    kabCode: 39,
  },
  {
    code: 25,
    kelurahan: "MANGKUBUMEN",
    pangkalan: 23,
    target: 1507,
    region: "Region 4",
    regCode: 4,
    kabupaten: "KOTA SURAKARTA",
    kabCode: 41,
  },
  {
    code: 26,
    kelurahan: "KARANGASEM",
    pangkalan: 12,
    target: 2224,
    region: "Region 5",
    regCode: 5,
    kabupaten: "KABUPATEN KARANGASEM",
    kabCode: 13,
  },
  {
    code: 27,
    kelurahan: "SIDOREJO",
    pangkalan: 12,
    target: 2297,
    region: "Region 5",
    regCode: 5,
    kabupaten: "KABUPATEN BLITAR",
    kabCode: 8,
  },
  {
    code: 28,
    kelurahan: "JAGIR",
    pangkalan: 10,
    target: 2064,
    region: "Region 5",
    regCode: 5,
    kabupaten: "KOTA SURABAYA",
    kabCode: 40,
  },
  {
    code: 29,
    kelurahan: "KOPANG REMBIGA",
    pangkalan: 14,
    target: 2386,
    region: "Region 5",
    regCode: 5,
    kabupaten: "KABUPATEN LOMBOK TENGAH",
    kabCode: 15,
  },
  {
    code: 31,
    kelurahan: "BARUTENGAH",
    pangkalan: 20,
    target: 2722,
    region: "Region 6",
    regCode: 6,
    kabupaten: "KOTA BALIKPAPAN",
    kabCode: 28,
  },
  {
    code: 30,
    kelurahan: "SUNGAIBELIUNG",
    pangkalan: 25,
    target: 5251,
    region: "Region 6",
    regCode: 6,
    kabupaten: "KOTA PONTIANAK",
    kabCode: 37,
  },
  {
    code: 32,
    kelurahan: "SEMPAJA UTARA",
    pangkalan: 10,
    target: 2567,
    region: "Region 6",
    regCode: 6,
    kabupaten: "KOTA SAMARINDA",
    kabCode: 38,
  },
  {
    code: 33,
    kelurahan: "POLEWALI",
    pangkalan: 14,
    target: 993,
    region: "Region 7",
    regCode: 7,
    kabupaten: "KABUPATEN POLEWALI",
    kabCode: 18,
  },
  {
    code: 34,
    kelurahan: "MARISO",
    pangkalan: 13,
    target: 959,
    region: "Region 7",
    regCode: 7,
    kabupaten: "KOTA MAKASSAR",
    kabCode: 35,
  },
];

const region = [
  { code: 1, label: "Region I" },
  { code: 2, label: "Region II" },
  { code: 3, label: "Region III" },
  { code: 4, label: "Region IV" },
  { code: 5, label: "Region V" },
  { code: 6, label: "Region VI" },
  { code: 7, label: "Region VII" },
];

const city = [
  16, 30, 36, 19, 21, 29, 32, 42, 24, 25, 26, 27, 7, 9, 11, 12, 14, 20, 31, 33,
  34, 10, 17, 39, 41, 13, 8, 40, 15, 28, 37, 38, 18, 35,
];

const kabupaten = [
  { code: 1, label: "BEKASI" },
  { code: 2, label: "BLITAR" },
  { code: 3, label: "BOGOR" },
  { code: 4, label: "BREBES" },
  { code: 5, label: "CIANJUR" },
  { code: 6, label: "INDRAMAYU" },
  { code: 7, label: "KAB. BEKASI" },
  { code: 8, label: "KAB. BLITAR" },
  { code: 9, label: "KAB. BOGOR" },
  { code: 10, label: "KAB. BREBES" },
  { code: 11, label: "KAB. CIANJUR" },
  { code: 12, label: "KAB. INDRAMAYU" },
  { code: 13, label: "KAB. KARANGASEM" },
  { code: 14, label: "KAB. KARAWANG" },
  { code: 15, label: "KAB. LOMBOK TENGAH" },
  { code: 16, label: "KAB. PASAMAN BARAT" },
  { code: 17, label: "KAB. PEMALANG" },
  { code: 18, label: "KAB. POLEWALI MANDAR" },
  { code: 19, label: "KAB. PRINGSEWU" },
  { code: 20, label: "KAB. TASIKMALAYA" },
  { code: 21, label: "KAB. TULANG BAWANG" },
  { code: 22, label: "KARANGASEM" },
  { code: 23, label: "KARAWANG" },
  { code: 24, label: "KOTA ADM. JAKARTA BARAT" },
  { code: 25, label: "KOTA ADM. JAKARTA PUSAT" },
  { code: 26, label: "KOTA ADM. JAKARTA SELATAN" },
  { code: 27, label: "KOTA ADM. JAKARTA UTARA" },
  { code: 28, label: "KOTA BALIKPAPAN" },
  { code: 29, label: "KOTA BANDAR LAMPUNG" },
  { code: 30, label: "KOTA BATAM" },
  { code: 31, label: "KOTA BEKASI" },
  { code: 32, label: "KOTA BENGKULU" },
  { code: 33, label: "KOTA CIREBON" },
  { code: 34, label: "KOTA DEPOK" },
  { code: 35, label: "KOTA MAKASSAR" },
  { code: 36, label: "KOTA MEDAN" },
  { code: 37, label: "KOTA PONTIANAK" },
  { code: 38, label: "KOTA SAMARINDA" },
  { code: 39, label: "KOTA SEMARANG" },
  { code: 40, label: "KOTA SURABAYA" },
  { code: 41, label: "KOTA SURAKARTA" },
  { code: 42, label: "KOTA TANGERANG SELATAN" },
  { code: 43, label: "LOMBOK TENGAH" },
  { code: 44, label: "PASAMAN BARAT" },
  { code: 45, label: "PEMALANG" },
  { code: 46, label: "POLEWALI MANDAR" },
  { code: 47, label: "PRINGSEWU" },
  { code: 48, label: "TASIKMALAYA" },
  { code: 49, label: "TULANG BAWANG" },
];

const mor = [1, 2, 3, 4, 5, 6, 7];

const cityByMor = [
  [16, 30, 36],
  [19, 21, 29, 32],
  [42, 24, 25, 26, 27, 7, 9, 11, 12, 14, 20, 31, 33, 34],
  [10, 17, 39, 41],
  [13, 8, 40, 15],
  [28, 37, 38],
  [18, 35],
];

const kelurahanByMor = [
  [1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25],
  [26, 27, 28, 29],
  [30, 31, 32],
  [33, 34],
];

const arrKelurahan = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
];

const arrPangkalan = [
  [207, 254],
  [41, 146, 189, 249],
  [11, 83, 92, 106, 136, 173, 177, 203],
  [90, 99, 201, 231],
  [46, 49, 193, 226, 245, 252],
  [26, 116, 180, 182],
  [3, 119, 160, 174, 200, 240],
  [36, 66, 67, 72, 77, 123, 140, 156, 165, 167, 227, 250],
  [1, 15, 52, 76, 86, 120, 124, 139, 166, 175],
  [27, 28, 152, 157, 162, 187, 219, 251],
  [21, 37, 39, 42, 71, 88, 93, 94, 111, 127, 128, 150, 171, 183, 190, 220, 248],
  [30, 60, 113, 125, 143, 158, 216, 233],
  [17, 24, 34, 40, 59, 73, 85, 87, 126, 135, 151, 179, 235],
  [18, 19, 43, 50, 95, 101, 117, 181, 194, 242, 247],
  [55, 58, 107, 168, 215],
  [5, 16, 31, 35, 53, 82, 112, 154, 225],
  [13, 25, 47, 89, 98, 105, 142, 149, 186, 210, 222, 241],
  [7, 32, 65, 129, 144, 147, 169, 218],
  [20, 192, 214, 221, 253],
  [33, 63, 138, 153, 184, 199, 204, 211],
  [38, 51, 91, 118, 197, 223],
  [14, 108, 109, 137, 161, 164],
  [56, 145, 166, 172, 206, 217],
  [
    4, 10, 48, 62, 64, 74, 96, 102, 115, 141, 148, 166, 202, 205, 209, 228, 229,
    237, 243,
  ],
  [8, 57, 81, 97, 130, 131, 159, 170, 246],
  [23, 110, 122, 212],
  [132, 188],
  [69, 70, 100, 104, 224, 230],
  [2, 68, 78, 121, 176, 208],
  [6, 22, 54, 61, 84, 133, 134, 196, 236, 244],
  [29, 75, 114, 163, 191, 239],
  [12, 44, 155, 195, 198, 213, 232],
  [79, 80, 103, 234],
  [9, 45, 178, 185, 238],
  [55, 58, 107, 168, 215],
  [33, 63, 138, 153, 184, 199, 204, 211],
  [33, 63, 138, 153, 184, 199, 204, 211],
  [33, 63, 138, 153, 184, 199, 204, 211],
  [5, 16, 31, 35, 53, 82, 112, 154, 225],
  [5, 16, 31, 35, 53, 82, 112, 154, 225],
  [7, 32, 65, 129, 144, 147, 169, 218],
];

global.filterCityByMor = async function (id) {
  const indexMor = mor.indexOf(parseInt(id));
  var arrResult = cityByMor[indexMor];
  var result = [];
  for (let i = 0; i < arrResult.length; i++) {
    var a = await findObj(dataPropana, "kabCode", arrResult[i]);
    result.push({
      code: dataPropana[a].kabCode,
      label: dataPropana[a].kabupaten,
    });
  }
  return result;
};

global.filterKelurahanByCity = function (id) {
  const indexCity = city.indexOf(parseInt(id));
  var result = dataPropana[indexCity];
  return result;
};

global.filterKelurahanByMor = function (id) {
  const indexMor = mor.indexOf(parseInt(id));
  var result = kelurahanByMor[indexMor];
  return result;
};

global.filterPangkalan = function (id) {
  const indexkelurahan = arrKelurahan.indexOf(parseInt(id));
  var result = arrPangkalan[indexkelurahan];
  return result;
};

global.getDataKelurahan = function (kode) {
  var result;
  for (let i = 0; i < dataPropana.length; i++) {
    if (parseInt(kode) == dataPropana[i].code) {
      result = dataPropana[i];
    }
  }
  return result;
};

global.getDataKelurahanByMor = function (kode) {
  var result = dataPropana.filter((data) => data.regCode === parseInt(kode));
  return result;
};

global.getDataRegion = function (kode) {
  var result;
  for (let i = 0; i < region.length; i++) {
    if (parseInt(kode) == region[i].code) {
      result = region[i];
    }
  }
  return result;
};

global.getDataKabupaten = function (kode) {
  var result;
  for (let i = 0; i < region.length; i++) {
    if (parseInt(kode) == region[i].code) {
      result = region[i];
    }
  }
  return result;
};

const age = [
  {
    code: 1,
    label: "Kurang dari 25 tahun",
  },
  {
    code: 2,
    label: "25 – 30 thn",
  },
  {
    code: 3,
    label: "31 – 35 thn",
  },
  {
    code: 4,
    label: "36 – 40 thn",
  },
  {
    code: 5,
    label: "41 – 45 thn",
  },
  {
    code: 6,
    label: "46 – 50 thn",
  },
  {
    code: 7,
    label: "Diatas 50 tahun",
  },
];

const ses = [
  {
    code: 1,
    label: "Nilai 15 - 18 (Upper 1)",
  },
  {
    code: 2,
    label: "Nilai 13 - 14 (Upper 2)",
  },
  {
    code: 3,
    label: "Nilai 11 - 12 (Middle 1)",
  },
  {
    code: 4,
    label: "Nilai 8 - 10 (Middle 2)",
  },
  {
    code: 5,
    label: "Nilai 5 - 7 (Lower 1)",
  },
];

const occupation = [
  {
    code: 1,
    label: "Top management (CEO/Chairman/Managing Director/President)",
  },
  {
    code: 2,
    label:
      "Middle up management (Direktur, General Manager, Vice President)   ",
  },
  {
    code: 3,
    label: "Middle management (Manager/Executive/Supervisor)",
  },
  {
    code: 4,
    label: "Karyawan pemula, contoh: staf junior, trainee, dll",
  },
  {
    code: 5,
    label: "Profesional (dokter, pengacara, konsultan,dll)",
  },
  {
    code: 6,
    label: "Wiraswasta",
  },
  {
    code: 7,
    label: "Pegawai negeri",
  },
  {
    code: 8,
    label: "TNI/ ABRI/ POLRI",
  },
  {
    code: 9,
    label: "Kontraktor",
  },
  {
    code: 10,
    label: "Buruh Bangunan",
  },
  {
    code: 11,
    label: "Karyawan biasa, contoh: SPG, Kasir, Satpam, dll",
  },
  {
    code: 12,
    label:
      " /Pekerja terlatih, contoh: tukang ledeng, montir, tukang listrik, tukang kayu, supir",
  },
  {
    code: 13,
    label: "Pekerja tidak terlatih, contoh : Buruh pabrik",
  },
  {
    code: 14,
    label: "Pekerja paruh waktu",
  },
  {
    code: 15,
    label: "Mahasiswa",
  },
  {
    code: 16,
    label: "Ibu rumah tangga",
  },
  {
    code: 17,
    label:
      "Kerja serabutan (pindah-pindah kerja dalam kurun waktu kurang dari 6 bulan)",
  },
  {
    code: 18,
    label: "Belum Bekerja",
  },
];

global.getAge = async function (code) {
  var result = await findObj(age, "code", parseInt(code));
  return age[result];
};

global.getSES = async function (code) {
  var result = await findObj(ses, "code", parseInt(code));
  return ses[result];
};

global.getOccupation = async function (code) {
  var result = await findObj(occupation, "code", parseInt(code));
  return occupation[result];
};
