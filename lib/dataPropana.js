const dataPropana = [
  {
    code: 2,
    kelurahan: "PARIT",
    pangkalan: 12,
    target: 3919,
  },
  {
    code: 1,
    kelurahan: "TANJUNGSENGKUANG",
    pangkalan: 50,
    target: 2800,
  },
  {
    code: 3,
    kelurahan: "BELAWANI",
    pangkalan: 16,
    target: 2467,
  },
  {
    code: 5,
    kelurahan: "PRINGSEWU UTARA",
    pangkalan: 15,
    target: 961,
  },
  {
    code: 6,
    kelurahan: "DWIWARGATUNGGALJAYA",
    pangkalan: 12,
    target: 927,
  },
  {
    code: 7,
    kelurahan: "KOTA BARU",
    pangkalan: 10,
    target: 1631,
  },
  {
    code: 4,
    kelurahan: "BETUNGAN",
    pangkalan: 17,
    target: 1536,
  },
  {
    code: 8,
    kelurahan: "SAWAHBARU",
    pangkalan: 20,
    target: 2450,
  },
  {
    code: 9,
    kelurahan: "KEDAUNGKALIANGKE",
    pangkalan: 15,
    target: 7609,
  },
  {
    code: 10,
    kelurahan: "UTANPANJANG",
    pangkalan: 10,
    target: 6919,
  },
  {
    code: 11,
    kelurahan: "SRENGSENGSAWAH",
    pangkalan: 40,
    target: 9509,
  },
  {
    code: 12,
    kelurahan: "RAWABADAKUTARA",
    pangkalan: 18,
    target: 7090,
  },
  {
    code: 13,
    kelurahan: "JATIMULYA",
    pangkalan: 39,
    target: 6715,
  },
  {
    code: 14,
    kelurahan: "NANGGEWER",
    pangkalan: 15,
    target: 4415,
  },
  {
    code: 15,
    kelurahan: "SAYANG",
    pangkalan: 16,
    target: 5026,
  },
  {
    code: 16,
    kelurahan: "PABEANUDIK",
    pangkalan: 11,
    target: 2611,
  },
  {
    code: 17,
    kelurahan: "KARAWANGPAWITAN",
    pangkalan: 19,
    target: 4111,
  },
  {
    code: 18,
    kelurahan: "MANONJAYA",
    pangkalan: 10,
    target: 724,
  },
  {
    code: 19,
    kelurahan: "HARAPANBARU",
    pangkalan: 10,
    target: 2320,
  },
  {
    code: 20,
    kelurahan: "KALIJAGA",
    pangkalan: 30,
    target: 6356,
  },
  {
    code: 21,
    kelurahan: "PONDOK PETIR",
    pangkalan: 12,
    target: 2407,
  },
  {
    code: 22,
    kelurahan: "SAWOJAJAR",
    pangkalan: 15,
    target: 2188,
  },
  {
    code: 23,
    kelurahan: "ASEMDOYONG",
    pangkalan: 14,
    target: 2345,
  },
  {
    code: 24,
    kelurahan: "TANJUNGMAS",
    pangkalan: 59,
    target: 4907,
  },
  {
    code: 25,
    kelurahan: "MANGKUBUMEN",
    pangkalan: 23,
    target: 1507,
  },
  {
    code: 26,
    kelurahan: "KARANGASEM",
    pangkalan: 12,
    target: 2224,
  },
  {
    code: 27,
    kelurahan: "SIDOREJO",
    pangkalan: 12,
    target: 2297,
  },
  {
    code: 28,
    kelurahan: "JAGIR",
    pangkalan: 10,
    target: 2064,
  },
  {
    code: 29,
    kelurahan: "KOPANGREMBIGA",
    pangkalan: 14,
    target: 2386,
  },
  {
    code: 31,
    kelurahan: "BARUTENGAH",
    pangkalan: 20,
    target: 2722,
  },
  {
    code: 30,
    kelurahan: "SUNGAIBELIUNG",
    pangkalan: 25,
    target: 5251,
  },
  {
    code: 32,
    kelurahan: "SEMPAJAUTARA",
    pangkalan: 10,
    target: 2567,
  },
  {
    code: 33,
    kelurahan: "POLEWALI",
    pangkalan: 14,
    target: 993,
  },
  {
    code: 34,
    kelurahan: "MARISO",
    pangkalan: 13,
    target: 959,
  },
];

global.getDataKelurahan = function (kode) {
  var result;
  for (let i = 0; i < dataPropana.length; i++) {
    if (parseInt(kode) == dataPropana[i].code) {
      result = dataPropana[i];
    }
  }
  return result;
};
