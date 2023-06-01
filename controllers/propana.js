const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');

require('../lib/index');
require('../lib/administration');
require('../lib/dataExcel');
require('../lib/hyundai');
require('../lib/glossary');

const A6Code = [
  { code: 1, label: 'Pangkalan aktif bertemu pemilik' },
  { code: 2, label: 'Tutup Permanen' },
  { code: 3, label: 'Pangkalan tidak ditemukan' },
  { code: 4, label: 'Pangkalan pindah alamat' },
  {
    code: 5,
    label: 'Sedang Tutup',
  },
  {
    code: 6,
    label: 'Pangkalan Aktif Tidak Ketemu Pemilik ',
  },
];

const A114Code = [
  { code: 1, label: 'Smartphone' },
  { code: 2, label: 'Tablet' },
  { code: 3, label: 'PC' },
  { code: 4, label: 'Laptop' },
];

const A12Code = [
  { code: 1, label: 'Belum On Boarding & Memiliki Device' },
  { code: 2, label: 'Belum On Boarding dan Tidak Memiliki Device' },
  { code: 3, label: 'On boarding belum transaksi' },
  { code: 4, label: 'On boarding transaksi' },
];

const helBoardingCode = [
  { code: 1, label: 'Berhasil dibantu on boarding' },
  { code: 2, label: 'Tidak Berhasil' },
];

const boardingNoTransactionCode = [
  { code: 1, label: 'Berhasil' },
  { code: 2, label: 'Tidak Berhasil' },
];

exports.getTargetPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = 0;
    if (region === '0') {
      if (province === '0') {
        var _getAdminstrationProvince = await getAdminstrationProvince(pid);
      } else {
        if (city === '0') {
          var _getAdminstrationProvince = await getAdminstrationProvinceById(
            pid,
            province
          );
        } else {
          var _getAdminstrationProvince = await getAdminstrationCityByName(
            pid,
            city
          );
        }
      }
    } else {
      if (province === '0') {
        var _getAdminstrationProvince = await getAdminstrationProvinceByRegion(
          pid,
          region
        );
      } else {
        if (city === '0') {
          var _getAdminstrationProvince = await getAdminstrationProvinceById(
            pid,
            province
          );
        } else {
          var _getAdminstrationProvince = await getAdminstrationCityByName(
            pid,
            city
          );
        }
      }
    }

    for (let i = 0; i < _getAdminstrationProvince.length; i++) {
      result = result + _getAdminstrationProvince[i].target;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTotalListPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = {
      dataList: 0,
      target: 0,
      percentage: 0,
    };
    if (region === '0') {
      if (province === '0') {
        var getDataCity = await getAdminstrationCityAll(pid);
      } else {
        if (city === '0') {
          var _getAdminstrationProvince = await getAdminstrationProvinceById(
            pid,
            province
          );
          var dataProvince = _getAdminstrationProvince.map(
            (data) => data.provinceName
          );
          var getDataCity = await getAdminstrationCityByArrayProvince(
            pid,
            dataProvince
          );
        } else {
          var getDataCity = await getAdminstrationCityByName(pid, city);
        }
      }
    } else {
      if (province === '0') {
        var _getAdminstrationProvince = await getAdminstrationProvinceByRegion(
          pid,
          region
        );
        var dataProvince = _getAdminstrationProvince.map(
          (data) => data.provinceName
        );
        var getDataCity = await getAdminstrationCityByArrayProvince(
          pid,
          dataProvince
        );
      } else {
        if (city === '0') {
          var getDataCity = await getAdminstrationCityByProvince(pid, province);
        } else {
          var getDataCity = await getAdminstrationCityByName(pid, city);
        }
      }
    }

    for (let i = 0; i < getDataCity.length; i++) {
      result.dataList = result.dataList + getDataCity[i].dataList;
      result.target = result.target + getDataCity[i].target;
    }

    result.percentage = (result.dataList / result.target) * 100;

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Pangkalan Data List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getVisitAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = 0;
    var data = await excelData(pid);
    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          result++;
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            result++;
          }
        } else {
          if (data[i]['A2'] === province) {
            result++;
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            result++;
          }
        } else {
          if (data[i]['A2'] === province) {
            result++;
          }
        }
      } else {
        result++;
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStatusVisitAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [];
    for (let i = 0; i < A6Code.length; i++) {
      result.push({
        code: A6Code[i].code,
        label: A6Code[i].label,
        value: 0,
      });
    }
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          if (
            data[i]['A6'] === 1 &&
            (data[i]['A7'] === 1 || data[i]['A7'] === 2)
          ) {
            result[0].value = result[0].value + 1;
          }
          if (data[i]['A6'] === 2) {
            result[1].value = result[1].value + 1;
          }
          if (data[i]['A6'] === 3) {
            result[2].value = result[2].value + 1;
          }
          if (data[i]['A6'] === 4) {
            result[3].value = result[3].value + 1;
          }
          if (data[i]['A6'] === 5) {
            result[4].value = result[4].value + 1;
          }
          if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
            result[5].value = result[5].value + 1;
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].value = result[3].value + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].value = result[4].value + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].value = result[5].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].value = result[3].value + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].value = result[4].value + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].value = result[5].value + 1;
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].value = result[3].value + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].value = result[4].value + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].value = result[5].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].value = result[3].value + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].value = result[4].value + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].value = result[5].value + 1;
            }
          }
        }
      } else {
        if (
          data[i]['A6'] === 1 &&
          (data[i]['A7'] === 1 || data[i]['A7'] === 2)
        ) {
          result[0].value = result[0].value + 1;
        }
        if (data[i]['A6'] === 2) {
          result[1].value = result[1].value + 1;
        }
        if (data[i]['A6'] === 3) {
          result[2].value = result[2].value + 1;
        }
        if (data[i]['A6'] === 4) {
          result[3].value = result[3].value + 1;
        }
        if (data[i]['A6'] === 5) {
          result[4].value = result[4].value + 1;
        }
        if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
          result[5].value = result[5].value + 1;
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStatusVisitAchievementPercent = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [];
    var total = 0;
    for (let i = 0; i < A6Code.length; i++) {
      result.push({
        code: A6Code[i].code,
        label: A6Code[i].label,
        count: 0,
        value: 0,
      });
    }
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          if (
            data[i]['A6'] === 1 &&
            (data[i]['A7'] === 1 || data[i]['A7'] === 2)
          ) {
            result[0].count = result[0].count + 1;
          }
          if (data[i]['A6'] === 2) {
            result[1].count = result[1].count + 1;
          }
          if (data[i]['A6'] === 3) {
            result[2].value = result[2].count + 1;
          }
          if (data[i]['A6'] === 4) {
            result[3].count = result[3].count + 1;
          }
          if (data[i]['A6'] === 5) {
            result[4].count = result[4].count + 1;
          }
          if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
            result[5].count = result[5].count + 1;
          }
          total++;
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].count = result[0].count + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].count = result[1].count + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].count + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].count = result[3].count + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].count = result[4].count + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].count = result[5].count + 1;
            }
            total++;
          }
        } else {
          if (data[i]['A2'] === province) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].count = result[0].count + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].count = result[1].count + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].count + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].count = result[3].count + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].count = result[4].count + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].count = result[5].count + 1;
            }
            total++;
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].count = result[0].count + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].count = result[1].count + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].count + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].count = result[3].count + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].count = result[4].count + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].count = result[5].count + 1;
            }
            total++;
          }
        } else {
          if (data[i]['A2'] === province) {
            if (
              data[i]['A6'] === 1 &&
              (data[i]['A7'] === 1 || data[i]['A7'] === 2)
            ) {
              result[0].count = result[0].count + 1;
            }
            if (data[i]['A6'] === 2) {
              result[1].count = result[1].count + 1;
            }
            if (data[i]['A6'] === 3) {
              result[2].value = result[2].count + 1;
            }
            if (data[i]['A6'] === 4) {
              result[3].count = result[3].count + 1;
            }
            if (data[i]['A6'] === 5) {
              result[4].count = result[4].count + 1;
            }
            if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
              result[5].count = result[5].count + 1;
            }
            total++;
          }
        }
      } else {
        if (
          data[i]['A6'] === 1 &&
          (data[i]['A7'] === 1 || data[i]['A7'] === 2)
        ) {
          result[0].count = result[0].count + 1;
        }
        if (data[i]['A6'] === 2) {
          result[1].count = result[1].count + 1;
        }
        if (data[i]['A6'] === 3) {
          result[2].value = result[2].count + 1;
        }
        if (data[i]['A6'] === 4) {
          result[3].count = result[3].count + 1;
        }
        if (data[i]['A6'] === 5) {
          result[4].count = result[4].count + 1;
        }
        if (data[i]['A6'] === 1 && data[i]['A7'] === 3) {
          result[5].count = result[5].count + 1;
        }
        total++;
      }
    }

    for (let i = 0; i < result.length; i++) {
      result[i].value = (result[i].count / total) * 100;
      result[i].value = decimalPlaces(result[i].value, 2);
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPosterAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [
      {
        code: 1,
        label: 'Ada',
        value: 0,
      },
      {
        code: 2,
        label: 'Tidak Ada',
        value: 0,
      },
    ];
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (data[i]['A35']) {
        if (region !== '0' && province === '0') {
          if (data[i]['A1'] === region) {
            result[data[i]['A35'] - 1].value =
              result[data[i]['A35'] - 1].value + 1;
          }
        } else if (region !== '0' && province !== '0') {
          if (city !== '0') {
            if (data[i]['A3'] === city) {
              result[data[i]['A35'] - 1].value =
                result[data[i]['A35'] - 1].value + 1;
            }
          } else {
            if (data[i]['A2'] === province) {
              result[data[i]['A35'] - 1].value =
                result[data[i]['A35'] - 1].value + 1;
            }
          }
        } else if (region === '0' && province !== '0') {
          if (city !== '0') {
            if (data[i]['A3'] === city) {
              result[data[i]['A35'] - 1].value =
                result[data[i]['A35'] - 1].value + 1;
            }
          } else {
            if (data[i]['A2'] === province) {
              result[data[i]['A35'] - 1].value =
                result[data[i]['A35'] - 1].value + 1;
            }
          }
        } else {
          result[data[i]['A35'] - 1].value =
            result[data[i]['A35'] - 1].value + 1;
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Achievement Poster',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPosterViewAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [
      {
        code: 1,
        label: 'Terlihat',
        value: 0,
      },
      {
        code: 2,
        label: 'Tidak Terlihat',
        value: 0,
      },
    ];
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (data[i]['A36']) {
        if (region !== '0' && province === '0') {
          if (data[i]['A1'] === region) {
            result[data[i]['A36'] - 1].value =
              result[data[i]['A36'] - 1].value + 1;
          }
        } else if (region !== '0' && province !== '0') {
          if (city !== '0') {
            if (data[i]['A3'] === city) {
              result[data[i]['A36'] - 1].value =
                result[data[i]['A36'] - 1].value + 1;
            }
          } else {
            if (data[i]['A2'] === province) {
              result[data[i]['A36'] - 1].value =
                result[data[i]['A36'] - 1].value + 1;
            }
          }
        } else if (region === '0' && province !== '0') {
          if (city !== '0') {
            if (data[i]['A3'] === city) {
              result[data[i]['A36'] - 1].value =
                result[data[i]['A36'] - 1].value + 1;
            }
          } else {
            if (data[i]['A2'] === province) {
              result[data[i]['A36'] - 1].value =
                result[data[i]['A36'] - 1].value + 1;
            }
          }
        } else {
          result[data[i]['A36'] - 1].value =
            result[data[i]['A36'] - 1].value + 1;
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Achievement Poster',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSortPoster = async function (req, res) {
  try {
    const pid = req.params.pid;
    const type = req.params.type;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var _getCity = await getAdminstrationCityAll(pid);

    var result = [];

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          var findCity = await findObj(result, 'label', data[i]['A3']);
          if (findCity === -1) {
            result.push({
              label: data[i]['A3'],
              value: 0,
              base: data[i]['A7'] === 1 || data[i]['A7'] === 2 ? 1 : 0,
              count: data[i]['A35'] === 1 ? 1 : 0,
            });
          } else {
            if (data[i]['A7'] === 1 || data[i]['A7'] === 2) {
              result[findCity].base = result[findCity].base + 1;
            }
            if (data[i]['A35'] === 1) {
              result[findCity].count = result[findCity].count + 1;
            }
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                value: 0,
                base: data[i]['A7'] === 1 || data[i]['A7'] === 2 ? 1 : 0,
                count: data[i]['A35'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A7'] === 1 || data[i]['A7'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A35'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                value: 0,
                base: data[i]['A7'] === 1 || data[i]['A7'] === 2 ? 1 : 0,
                count: data[i]['A35'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A7'] === 1 || data[i]['A7'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A35'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                value: 0,
                base: data[i]['A7'] === 1 || data[i]['A7'] === 2 ? 1 : 0,
                count: data[i]['A35'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A7'] === 1 || data[i]['A7'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A35'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                value: 0,
                base: data[i]['A7'] === 1 || data[i]['A7'] === 2 ? 1 : 0,
                count: data[i]['A35'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A7'] === 1 || data[i]['A7'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A35'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        }
      } else {
        var findCity = await findObj(result, 'label', data[i]['A3']);
        if (findCity === -1) {
          result.push({
            label: data[i]['A3'],
            value: 0,
            base: data[i]['A7'] === 1 || data[i]['A7'] === 2 ? 1 : 0,
            count: data[i]['A35'] === 1 ? 1 : 0,
          });
        } else {
          if (data[i]['A7'] === 1 || data[i]['A7'] === 2) {
            result[findCity].base = result[findCity].base + 1;
          }
          if (data[i]['A35'] === 1) {
            result[findCity].count = result[findCity].count + 1;
          }
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].base > 0) {
        result[i].value = (result[i].count / result[i].base) * 100;
        result[i].value = decimalPlaces(result[i].value, 2);
      } else {
        result[i].value = 0;
      }
    }

    if (type === 'top') {
      bubbleSort(result, 'value');
    } else {
      bubbleSortAsc(result, 'value');
    }

    var response = [];

    for (let i = 0; i < result.length; i++) {
      if (i < 10) {
        response.push(result[i]);
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Sort Poster',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStatusOnBoardingPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [];
    for (let i = 0; i < A12Code.length; i++) {
      result.push({
        code: A12Code[i].code,
        label: A12Code[i].label,
        value: 0,
      });
    }
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          if (data[i]['A12'] === 1 && data[i]['A113'] === 1) {
            result[0].value = result[0].value + 1;
          }
          if (data[i]['A113'] === 2) {
            result[1].value = result[1].value + 1;
          }
          if (data[i]['A12'] === 2) {
            result[2].value = result[2].value + 1;
          }
          if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
            result[3].value = result[3].value + 1;
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (data[i]['A12'] === 1 && data[i]['A113'] === 1) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A113'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 2) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[3].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (data[i]['A12'] === 1 && data[i]['A113'] === 1) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A113'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 2) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[3].value + 1;
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (data[i]['A12'] === 1 && data[i]['A113'] === 1) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A113'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 2) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[3].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (data[i]['A12'] === 1 && data[i]['A113'] === 1) {
              result[0].value = result[0].value + 1;
            }
            if (data[i]['A113'] === 2) {
              result[1].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 2) {
              result[2].value = result[2].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[3].value + 1;
            }
          }
        }
      } else {
        if (data[i]['A12'] === 1 && data[i]['A113'] === 1) {
          result[0].value = result[0].value + 1;
        }
        if (data[i]['A113'] === 2) {
          result[1].value = result[1].value + 1;
        }
        if (data[i]['A12'] === 2) {
          result[2].value = result[2].value + 1;
        }
        if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
          result[3].value = result[3].value + 1;
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement boarding pangkalan',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHelpBoardingPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [];
    for (let i = 0; i < helBoardingCode.length; i++) {
      result.push({
        code: helBoardingCode[i].code,
        label: helBoardingCode[i].label,
        value: 0,
      });
    }
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          if (data[i]['A31'] === 1) {
            result[0].value = result[0].value + 1;
          } else {
            result[1].value = result[1].value + 1;
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (data[i]['A31'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (data[i]['A31'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (data[i]['A31'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (data[i]['A31'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        }
      } else {
        if (data[i]['A31'] === 1) {
          result[0].value = result[0].value + 1;
        } else {
          result[1].value = result[1].value + 1;
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement boarding pangkalan',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSortBoarding = async function (req, res) {
  try {
    const pid = req.params.pid;
    const type = req.params.type;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var _getCity = await getAdminstrationCityAll(pid);

    var result = [];

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          var findCity = await findObj(result, 'label', data[i]['A3']);
          if (findCity === -1) {
            result.push({
              label: data[i]['A3'],
              count: data[i]['A31'] === 1 ? 1 : 0,
              value: 0,
              base: data[i]['A113'] === 1 && data[i]['A12'] === 1 ? 1 : 0,
            });
          } else {
            if (data[i]['A113'] === 1 && data[i]['A12'] === 1) {
              result[findCity].base = result[findCity].base + 1;
            }
            if (data[i]['A31'] === 1) {
              result[findCity].count = result[findCity].count + 1;
            }
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A31'] === 1 ? 1 : 0,
                value: 0,
                base: data[i]['A113'] === 1 && data[i]['A12'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A113'] === 1 && data[i]['A12'] === 1) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A31'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A31'] === 1 ? 1 : 0,
                value: 0,
                base: data[i]['A113'] === 1 && data[i]['A12'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A113'] === 1 && data[i]['A12'] === 1) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A31'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A31'] === 1 ? 1 : 0,
                value: 0,
                base: data[i]['A113'] === 1 && data[i]['A12'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A113'] === 1 && data[i]['A12'] === 1) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A31'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A31'] === 1 ? 1 : 0,
                value: 0,
                base: data[i]['A113'] === 1 && data[i]['A12'] === 1 ? 1 : 0,
              });
            } else {
              if (data[i]['A113'] === 1 && data[i]['A12'] === 1) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A31'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        }
      } else {
        var findCity = await findObj(result, 'label', data[i]['A3']);
        if (findCity === -1) {
          result.push({
            label: data[i]['A3'],
            count: data[i]['A31'] === 1 ? 1 : 0,
            value: 0,
            base: data[i]['A113'] === 1 && data[i]['A12'] === 1 ? 1 : 0,
          });
        } else {
          if (data[i]['A113'] === 1 && data[i]['A12'] === 1) {
            result[findCity].base = result[findCity].base + 1;
          }
          if (data[i]['A31'] === 1) {
            result[findCity].count = result[findCity].count + 1;
          }
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].base > 0) {
        result[i].value = (result[i].count / result[i].base) * 100;
        result[i].value = decimalPlaces(result[i].value, 2);
      } else {
        result[i].value;
      }
    }

    if (type === 'top') {
      bubbleSort(result, 'value');
    } else {
      bubbleSortAsc(result, 'value');
    }

    var response = [];

    for (let i = 0; i < result.length; i++) {
      if (result[i].base > 0) {
        if (response.length < 10) {
          response.push(result[i]);
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Sort Poster',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getVisitByRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    const province = req.query.province;

    var result = [];
    if (parseInt(province) !== 0) {
      var _getAdminstrationProvince = await getAdminstrationProvinceById(
        pid,
        province
      );
    } else {
      var _getAdminstrationProvince = await getAdminstrationProvince(pid);
    }
    for (let i = 0; i < _getAdminstrationProvince.length; i++) {
      result.push({
        code: _getAdminstrationProvince[i].idProvince,
        label: _getAdminstrationProvince[i].provinceName,
        target: _getAdminstrationProvince[i].target,
        count: 0,
        value: 0,
      });
    }

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      var findData = await findObj(result, 'label', data[i]['A2']);
      if (findData !== -1) {
        result[findData].value = result[findData].value + 1;
      }
    }

    // for (let i = 0; i < result.length; i++) {
    //   result[i].value = result[i].count / result[i].target;
    // }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getVisitByCity = async function (req, res) {
  try {
    const pid = req.params.pid;
    const province = req.query.province;
    const city = req.query.city;
    const region = req.query.region;

    var result = [];
    if (region === '0') {
      if (province === '0') {
        var _getAdminstrationCityAll = await getAdminstrationCityAll(pid);
      } else {
        if (city === '0') {
          var _getAdminstrationCityAll = await getAdminstrationCityByProvince(
            pid,
            province
          );
        } else {
          var _getAdminstrationCityAll = await getAdminstrationCityByName(
            pid,
            city
          );
        }
      }
    } else {
      if (province === '0') {
        var _getAdminstrationProvinceByRegion =
          await getAdminstrationProvinceByRegion(pid, region);
        var dataProvince = _getAdminstrationProvinceByRegion.map(
          (data) => data.provinceName
        );
        var _getAdminstrationCityAll =
          await getAdminstrationCityByArrayProvince(pid, dataProvince);
      } else {
        if (city === '0') {
          var _getAdminstrationCityAll = await getAdminstrationCityByProvince(
            pid,
            province
          );
        } else {
          var _getAdminstrationCityAll = await getAdminstrationCityByName(
            pid,
            city
          );
        }
      }
    }

    for (let i = 0; i < _getAdminstrationCityAll.length; i++) {
      result.push({
        code: _getAdminstrationCityAll[i].idCity,
        province: _getAdminstrationCityAll[i].areaName,
        cityName: _getAdminstrationCityAll[i].cityName,
        dataList: _getAdminstrationCityAll[i].dataList,
        visit: 0,
        visitPercentage: 0,
        pangkalanAktif: 0,
        tutupPermanen: 0,
        tidakDitemukan: 0,
        pindahAlamat: 0,
        tutupSaatKunjungan: 0,
        pangkalanAktif2: 0, // belum masuk
        notBoardingWithDevice: 0,
        notBoardingNoDevice: 0,
        boardingNoTransaction: 0,
        boardingTransaction: 0,
        successBoarding: 0,
        failedEmail: 0,
        failedDontWantOnBoard: 0,
        failedOthers: 0,
        boardingSuccessTransaction: 0,
        boardingFailedTransaction: 0,
        successTransaction: 0,
        failedTransaction: 0,
      });
    }

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      var findData = await findObj(result, 'cityName', data[i]['A3']);
      if (findData !== -1) {
        result[findData].visit = result[findData].visit + 1;

        //status kunjungan pangkalan
        if (data[i]['A6'] === 1) {
          result[findData].pangkalanAktif = result[findData].pangkalanAktif + 1;
        }
        if (data[i]['A6'] === 2) {
          result[findData].tutupPermanen = result[findData].tutupPermanen + 1;
        }
        if (data[i]['A6'] === 3) {
          result[findData].tidakDitemukan = result[findData].tidakDitemukan + 1;
        }
        if (data[i]['A6'] === 4) {
          result[findData].pindahAlamat = result[findData].pindahAlamat + 1;
        }
        if (data[i]['A6'] === 5) {
          result[findData].tutupSaatKunjungan =
            result[findData].tutupSaatKunjungan + 1;
        }

        // status boarding pangkalan
        if (data[i]['A113'] === 1) {
          result[findData].notBoardingWithDevice =
            result[findData].notBoardingWithDevice + 1;
        }
        if (data[i]['A113'] === 2) {
          result[findData].notBoardingNoDevice =
            result[findData].notBoardingNoDevice + 1;
        }
        if (data[i]['A12'] === 2) {
          result[findData].boardingNoTransaction =
            result[findData].boardingNoTransaction + 1;
        }
        if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
          result[findData].boardingTransaction =
            result[findData].boardingTransaction + 1;
        }

        // belum on boarding
        if (data[i]['A31'] === 1) {
          result[findData].successBoarding =
            result[findData].successBoarding + 1;
        }
        if (data[i]['A31'] === 2) {
          result[findData].failedEmail = result[findData].failedEmail + 1;
        }
        if (data[i]['A31'] === 3) {
          result[findData].failedDontWantOnBoard =
            result[findData].failedDontWantOnBoard + 1;
        }
        if (data[i]['A31'] === 4) {
          result[findData].failedOthers = result[findData].failedOthers + 1;
        }

        // transaction
        if (data[i]['A50'] === 1) {
          result[findData].boardingSuccessTransaction =
            result[findData].boardingSuccessTransaction + 1;
        }
        if (data[i]['A50'] === 2 || data[i]['A50'] === 3) {
          result[findData].boardingFailedTransaction =
            result[findData].boardingFailedTransaction + 1;
        }
        if (data[i]['A33'] === 1) {
          result[findData].successTransaction =
            result[findData].successTransaction + 1;
        }
        if (data[i]['A33'] === 2 || data[i]['A33'] === 3) {
          result[findData].failedTransaction =
            result[findData].failedTransaction + 1;
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].visit > 0) {
        result[i].visitPercentage =
          (result[i].visit / result[i].dataList) * 100;
      }
    }

    bubbleSort(result, 'visitPercentage');

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Achievement by cities',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementDeviceType = async function (req, res) {
  try {
    const pid = req.params.pid;
    const province = req.query.province;
    const city = req.query.city;

    var result = [];
    var data = await excelData(pid);
    var countData = 0;

    for (let i = 0; i < A114Code.length; i++) {
      result.push({
        code: A114Code[i].code,
        label: A114Code[i].label,
        count: 0,
        value: 0,
      });
    }

    for (let i = 0; i < data.length; i++) {
      if (parseInt(province) !== 0 && parseInt(city) === 0) {
        if (data[i]['A2'] === province) {
          result[data[i]['A114'] - 1].count =
            result[data[i]['A114'] - 1].count + 1;

          countData++;
        }
      } else if (parseInt(province) !== 0 && parseInt(city) !== 0) {
        if (data[i]['A3'] === city) {
          result[data[i]['A114'] - 1].count =
            result[data[i]['A114'] - 1].count + 1;
          countData++;
        }
      } else {
        result[data[i]['A114'] - 1].count =
          result[data[i]['A114'] - 1].count + 1;
        countData++;
      }
    }

    for (let i = 0; i < result.length; i++) {
      result[i].value = (result[i].count / countData) * 100;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Achievement by cities',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementDeviceTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const province = req.query.province;
    const city = req.query.city;

    var result = 0;
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (parseInt(province) !== 0 && parseInt(city) === 0) {
        if (data[i]['A2'] === province) {
          if (data[i]['A113'] === 1) {
            result++;
          }
        }
      } else if (parseInt(province) !== 0 && parseInt(city) !== 0) {
        if (data[i]['A3'] === city) {
          if (data[i]['A113'] === 1) {
            result++;
          }
        }
      } else {
        if (data[i]['A113'] === 1) {
          result++;
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      result[i].value = (result[i].count / data.length) * 100;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Achievement by cities',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getDataListPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var data = await excelData(pid);
    var result = [];

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          var A14 = [
            data[i]['A14_1'] > 0 && 1,
            data[i]['A14_2'] > 0 && 2,
            data[i]['A14_3'] > 0 && 3,
            data[i]['A14_4'] > 0 && 4,
            data[i]['A14_5'] > 0 && 5,
            data[i]['A14_6'] > 0 && 6,
            data[i]['A14_7'] > 0 && 7,
          ];
          var A18 = [
            data[i]['A18_1'] > 0 && 1,
            data[i]['A18_2'] > 0 && 2,
            data[i]['A18_3'] > 0 && 3,
            data[i]['A18_4'] > 0 && 4,
            data[i]['A18_5'] > 0 && 5,
            data[i]['A18_6'] > 0 && 6,
            data[i]['A18_7'] > 0 && 7,
            data[i]['A18_8'] > 0 && 8,
            data[i]['A18_9'] > 0 && 9,
            data[i]['A18_10'] > 0 && 10,
            data[i]['A18_11'] > 0 && 11,
            data[i]['A18_12'] > 0 && 12,
            data[i]['A18_13'] > 0 && 13,
          ];
          var A21 = [
            data[i]['A21_1'] > 0 && 1,
            data[i]['A21_2'] > 0 && 2,
            data[i]['A21_3'] > 0 && 3,
            data[i]['A21_4'] > 0 && 4,
            data[i]['A21_5'] > 0 && 5,
            data[i]['A21_6'] > 0 && 6,
            data[i]['A21_7'] > 0 && 7,
            data[i]['A21_8'] > 0 && 8,
            data[i]['A21_9'] > 0 && 9,
            data[i]['A21_10'] > 0 && 10,
            data[i]['A21_11'] > 0 && 11,
          ];
          result.push({
            id: data[i]['KID_Pangkalan'],
            region: data[i]['A1'],
            province: data[i]['A2'],
            city: data[i]['A3'],
            key: data[i]['KID_KEPO'],
            pangkalan: data[i]['NAMAPEMILIK'],
            kecamatan: data[i]['KECAMATAN'],
            kelurahan: data[i]['KELURAHAN'],
            A6: data[i]['A6'],
            A6C: data[i]['A6C'],
            A6b: data[i]['A6b'],
            A113: data[i]['A113'],
            A12: data[i]['A12'],
            A13: data[i]['A13'],
            A13: data[i]['A13'],
            A14: A14,
            A28: data[i]['A28'],
            A29: data[i]['A29'],
            A29B: data[i]['A29B'],
            A31: data[i]['A31'],
            A18: A18,
            A33: data[i]['A33'],
            A20: data[i]['A20'],
            A21: A21,
            A35: data[i]['A35'],
            A36: data[i]['A36'],
          });
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var A14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            result.push({
              id: data[i]['KID_Pangkalan'],
              region: data[i]['A1'],
              province: data[i]['A2'],
              city: data[i]['A3'],
              key: data[i]['KID_KEPO'],
              pangkalan: data[i]['NAMAPEMILIK'],
              kecamatan: data[i]['KECAMATAN'],
              kelurahan: data[i]['KELURAHAN'],
              A6: data[i]['A6'],
              A6C: data[i]['A6C'],
              A6b: data[i]['A6b'],
              A113: data[i]['A113'],
              A12: data[i]['A12'],
              A13: data[i]['A13'],
              A13: data[i]['A13'],
              A14: A14,
              A28: data[i]['A28'],
              A29: data[i]['A29'],
              A29B: data[i]['A29B'],
              A31: data[i]['A31'],
              A18: '',
              A33: data[i]['A33'],
              A20: data[i]['A20'],
              A21: '',
              A35: data[i]['A35'],
              A36: data[i]['A36'],
            });
          }
        } else {
          if (data[i]['A2'] === province) {
            var A14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var A18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var A21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            result.push({
              id: data[i]['KID_Pangkalan'],
              region: data[i]['A1'],
              province: data[i]['A2'],
              city: data[i]['A3'],
              key: data[i]['KID_KEPO'],
              pangkalan: data[i]['NAMAPEMILIK'],
              kecamatan: data[i]['KECAMATAN'],
              kelurahan: data[i]['KELURAHAN'],
              A6: data[i]['A6'],
              A6C: data[i]['A6C'],
              A6b: data[i]['A6b'],
              A113: data[i]['A113'],
              A12: data[i]['A12'],
              A13: data[i]['A13'],
              A13: data[i]['A13'],
              A14: A14,
              A28: data[i]['A28'],
              A29: data[i]['A29'],
              A29B: data[i]['A29B'],
              A31: data[i]['A31'],
              A18: A18,
              A33: data[i]['A33'],
              A20: data[i]['A20'],
              A21: A21,
              A35: data[i]['A35'],
              A36: data[i]['A36'],
            });
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var A14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var A18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var A21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            result.push({
              id: data[i]['KID_Pangkalan'],
              region: data[i]['A1'],
              province: data[i]['A2'],
              city: data[i]['A3'],
              key: data[i]['KID_KEPO'],
              pangkalan: data[i]['NAMAPEMILIK'],
              kecamatan: data[i]['KECAMATAN'],
              kelurahan: data[i]['KELURAHAN'],
              A6: data[i]['A6'],
              A6C: data[i]['A6C'],
              A6b: data[i]['A6b'],
              A113: data[i]['A113'],
              A12: data[i]['A12'],
              A13: data[i]['A13'],
              A13: data[i]['A13'],
              A14: A14,
              A28: data[i]['A28'],
              A29: data[i]['A29'],
              A29B: data[i]['A29B'],
              A31: data[i]['A31'],
              A18: A18,
              A33: data[i]['A33'],
              A20: data[i]['A20'],
              A21: A21,
              A35: data[i]['A35'],
              A36: data[i]['A36'],
            });
          }
        } else {
          if (data[i]['A2'] === province) {
            var A14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var A18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var A21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            result.push({
              id: data[i]['KID_Pangkalan'],
              region: data[i]['A1'],
              province: data[i]['A2'],
              city: data[i]['A3'],
              key: data[i]['KID_KEPO'],
              pangkalan: data[i]['NAMAPEMILIK'],
              kecamatan: data[i]['KECAMATAN'],
              kelurahan: data[i]['KELURAHAN'],
              A6: data[i]['A6'],
              A6C: data[i]['A6C'],
              A6b: data[i]['A6b'],
              A113: data[i]['A113'],
              A12: data[i]['A12'],
              A13: data[i]['A13'],
              A13: data[i]['A13'],
              A14: A14,
              A28: data[i]['A28'],
              A29: data[i]['A29'],
              A29B: data[i]['A29B'],
              A31: data[i]['A31'],
              A18: A18,
              A33: data[i]['A33'],
              A20: data[i]['A20'],
              A21: A21,
              A35: data[i]['A35'],
              A36: data[i]['A36'],
            });
          }
        }
      } else {
        var A14 = [
          data[i]['A14_1'] > 0 && 1,
          data[i]['A14_2'] > 0 && 2,
          data[i]['A14_3'] > 0 && 3,
          data[i]['A14_4'] > 0 && 4,
          data[i]['A14_5'] > 0 && 5,
          data[i]['A14_6'] > 0 && 6,
          data[i]['A14_7'] > 0 && 7,
        ];
        var A18 = [
          data[i]['A18_1'] > 0 && 1,
          data[i]['A18_2'] > 0 && 2,
          data[i]['A18_3'] > 0 && 3,
          data[i]['A18_4'] > 0 && 4,
          data[i]['A18_5'] > 0 && 5,
          data[i]['A18_6'] > 0 && 6,
          data[i]['A18_7'] > 0 && 7,
          data[i]['A18_8'] > 0 && 8,
          data[i]['A18_9'] > 0 && 9,
          data[i]['A18_10'] > 0 && 10,
          data[i]['A18_11'] > 0 && 11,
          data[i]['A18_12'] > 0 && 12,
          data[i]['A18_13'] > 0 && 13,
        ];
        var A21 = [
          data[i]['A21_1'] > 0 && 1,
          data[i]['A21_2'] > 0 && 2,
          data[i]['A21_3'] > 0 && 3,
          data[i]['A21_4'] > 0 && 4,
          data[i]['A21_5'] > 0 && 5,
          data[i]['A21_6'] > 0 && 6,
          data[i]['A21_7'] > 0 && 7,
          data[i]['A21_8'] > 0 && 8,
          data[i]['A21_9'] > 0 && 9,
          data[i]['A21_10'] > 0 && 10,
          data[i]['A21_11'] > 0 && 11,
        ];
        result.push({
          id: data[i]['KID_Pangkalan'],
          region: data[i]['A1'],
          province: data[i]['A2'],
          city: data[i]['A3'],
          key: data[i]['KID_KEPO'],
          pangkalan: data[i]['NAMAPEMILIK'],
          kecamatan: data[i]['KECAMATAN'],
          kelurahan: data[i]['KELURAHAN'],
          A6: data[i]['A6'],
          A6C: data[i]['A6C'],
          A6b: data[i]['A6b'],
          A113: data[i]['A113'],
          A12: data[i]['A12'],
          A13: data[i]['A13'],
          A13: data[i]['A13'],
          A14: A14,
          A28: data[i]['A28'],
          A29: data[i]['A29'],
          A29B: data[i]['A29B'],
          A31: data[i]['A31'],
          A18: A18,
          A33: data[i]['A33'],
          A20: data[i]['A20'],
          A21: A21,
          A35: data[i]['A35'],
          A36: data[i]['A36'],
        });
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Pangkalan List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getDetailPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const key = req.params.key;
    var result = '';

    var data = await excelData(pid);
    var findData = await findObj(data, 'KID_KEPO', key);
    result = {
      province: data[findData]['A2'],
      city: data[findData]['A3'],
      key: data[findData]['KID_KEPO'],
      pangkalan: data[findData]['NAMAPEMILIK'],
      kecamatan: data[findData]['KECAMATAN'],
      kelurahan: data[findData]['KELURAHAN'],
    };

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Pangkalan List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

// on boarding belum transaksi
exports.getOnBoardingNoTransaction = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = [];
    for (let i = 0; i < boardingNoTransactionCode.length; i++) {
      result.push({
        code: boardingNoTransactionCode[i].code,
        label: boardingNoTransactionCode[i].label,
        value: 0,
      });
    }
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          if (data[i]['A33'] === 1) {
            result[0].value = result[0].value + 1;
          } else {
            result[1].value = result[1].value + 1;
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (data[i]['A33'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (data[i]['A33'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            if (data[i]['A33'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            if (data[i]['A33'] === 1) {
              result[0].value = result[0].value + 1;
            } else {
              result[1].value = result[1].value + 1;
            }
          }
        }
      } else {
        if (data[i]['A33'] === 1) {
          result[0].value = result[0].value + 1;
        } else {
          result[1].value = result[1].value + 1;
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement boarding pangkalan',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSortBoardingTransaction = async function (req, res) {
  try {
    const pid = req.params.pid;
    const type = req.params.type;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var _getCity = await getAdminstrationCityAll(pid);

    var result = [];

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          var findCity = await findObj(result, 'label', data[i]['A3']);
          if (findCity === -1) {
            result.push({
              label: data[i]['A3'],
              count: data[i]['A33'] === 1 ? 1 : 0,
              base: data[i]['A12'] === 2 ? 1 : 0,
              value: 0,
            });
          } else {
            if (data[i]['A12'] === 2) {
              result[findCity].base = result[findCity].base + 1;
            }
            if (data[i]['A33'] === 1) {
              result[findCity].count = result[findCity].count + 1;
            }
          }
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A33'] === 1 ? 1 : 0,
                base: data[i]['A12'] === 2 ? 1 : 0,
                value: 0,
              });
            } else {
              if (data[i]['A12'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A33'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A33'] === 1 ? 1 : 0,
                base: data[i]['A12'] === 2 ? 1 : 0,
                value: 0,
              });
            } else {
              if (data[i]['A12'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A33'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A33'] === 1 ? 1 : 0,
                base: data[i]['A12'] === 2 ? 1 : 0,
                value: 0,
              });
            } else {
              if (data[i]['A12'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A33'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        } else {
          if (data[i]['A2'] === province) {
            var findCity = await findObj(result, 'label', data[i]['A3']);
            if (findCity === -1) {
              result.push({
                label: data[i]['A3'],
                count: data[i]['A33'] === 1 ? 1 : 0,
                base: data[i]['A12'] === 2 ? 1 : 0,
                value: 0,
              });
            } else {
              if (data[i]['A12'] === 2) {
                result[findCity].base = result[findCity].base + 1;
              }
              if (data[i]['A33'] === 1) {
                result[findCity].count = result[findCity].count + 1;
              }
            }
          }
        }
      } else {
        var findCity = await findObj(result, 'label', data[i]['A3']);
        if (findCity === -1) {
          result.push({
            label: data[i]['A3'],
            count: data[i]['A33'] === 1 ? 1 : 0,
            base: data[i]['A12'] === 2 ? 1 : 0,
            value: 0,
          });
        } else {
          if (data[i]['A12'] === 2) {
            result[findCity].base = result[findCity].base + 1;
          }
          if (data[i]['A33'] === 1) {
            result[findCity].count = result[findCity].count + 1;
          }
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].base > 0) {
        result[i].value = (result[i].count / result[i].base) * 100;
        result[i].value = decimalPlaces(result[i].value, 2);
      } else {
        result[i].value = 0;
      }
    }

    if (type === 'top') {
      bubbleSort(result, 'value');
    } else {
      bubbleSortAsc(result, 'value');
    }

    var response = [];

    for (let i = 0; i < result.length; i++) {
      if (result[i].base > 0) {
        if (response.length < 10) {
          response.push(result[i]);
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Sort Poster',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getExportPangkalan = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;
    var data = await excelData(pid);
    var isifile = [];

    for (let i = 0; i < data.length; i++) {
      if (region !== '0' && province === '0') {
        if (data[i]['A1'] === region) {
          var datas = [];
          var dataA14 = [
            data[i]['A14_1'] > 0 && 1,
            data[i]['A14_2'] > 0 && 2,
            data[i]['A14_3'] > 0 && 3,
            data[i]['A14_4'] > 0 && 4,
            data[i]['A14_5'] > 0 && 5,
            data[i]['A14_6'] > 0 && 6,
            data[i]['A14_7'] > 0 && 7,
          ];
          var dataA18 = [
            data[i]['A18_1'] > 0 && 1,
            data[i]['A18_2'] > 0 && 2,
            data[i]['A18_3'] > 0 && 3,
            data[i]['A18_4'] > 0 && 4,
            data[i]['A18_5'] > 0 && 5,
            data[i]['A18_6'] > 0 && 6,
            data[i]['A18_7'] > 0 && 7,
            data[i]['A18_8'] > 0 && 8,
            data[i]['A18_9'] > 0 && 9,
            data[i]['A18_10'] > 0 && 10,
            data[i]['A18_11'] > 0 && 11,
            data[i]['A18_12'] > 0 && 12,
            data[i]['A18_13'] > 0 && 13,
          ];
          var dataA21 = [
            data[i]['A21_1'] > 0 && 1,
            data[i]['A21_2'] > 0 && 2,
            data[i]['A21_3'] > 0 && 3,
            data[i]['A21_4'] > 0 && 4,
            data[i]['A21_5'] > 0 && 5,
            data[i]['A21_6'] > 0 && 6,
            data[i]['A21_7'] > 0 && 7,
            data[i]['A21_8'] > 0 && 8,
            data[i]['A21_9'] > 0 && 9,
            data[i]['A21_10'] > 0 && 10,
            data[i]['A21_11'] > 0 && 11,
          ];
          datas.push(
            data[i]['KID_Pangkalan'],
            data[i]['NAMAPEMILIK'],
            data[i]['A1'],
            data[i]['A2'],
            data[i]['A3'],
            data[i]['KECAMATAN'],
            data[i]['KELURAHAN'],
            data[i]['A6'] >= 1 ? A6(data[i]['A6']) : '',
            data[i]['A6C'],
            data[i]['A6b'],
            data[i]['A113'] >= 1 ? A113(data[i]['A113']) : '',
            data[i]['A12'] >= 1 ? A12(data[i]['A12']) : '',
            data[i]['A13'] >= 1 ? A13(data[i]['A13']) : '',
            A14(dataA14),
            data[i]['A28'] >= 1 ? A28(data[i]['A28']) : '',
            data[i]['A29'] ? data[i]['A29'] : '',
            data[i]['A29B'],
            data[i]['A31'] >= 1 ? A31(data[i]['A31']) : '',
            A18(dataA18),
            data[i]['A33'] >= 1 ? A33(data[i]['A33']) : '',
            data[i]['A20'] >= 1 ? A20(data[i]['A20']) : '',
            A21(dataA21),
            data[i]['A35'] >= 1 ? A35(data[i]['A35']) : '',
            data[i]['A36'] >= 1 ? A36(data[i]['A36']) : ''
          );
          isifile.push(datas);
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var datas = [];
            var dataA14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var dataA18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var dataA21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            datas.push(
              data[i]['KID_Pangkalan'],
              data[i]['NAMAPEMILIK'],
              data[i]['A1'],
              data[i]['A2'],
              data[i]['A3'],
              data[i]['KECAMATAN'],
              data[i]['KELURAHAN'],
              data[i]['A6'] >= 1 ? A6(data[i]['A6']) : '',
              data[i]['A6C'],
              data[i]['A6b'],
              data[i]['A113'] >= 1 ? A113(data[i]['A113']) : '',
              data[i]['A12'] >= 1 ? A12(data[i]['A12']) : '',
              data[i]['A13'] >= 1 ? A13(data[i]['A13']) : '',
              A14(dataA14),
              data[i]['A28'] >= 1 ? A28(data[i]['A28']) : '',
              data[i]['A29'] ? data[i]['A29'] : '',
              data[i]['A29B'],
              data[i]['A31'] >= 1 ? A31(data[i]['A31']) : '',
              A18(dataA18),
              data[i]['A33'] >= 1 ? A33(data[i]['A33']) : '',
              data[i]['A20'] >= 1 ? A20(data[i]['A20']) : '',
              A21(dataA21),
              data[i]['A35'] >= 1 ? A35(data[i]['A35']) : '',
              data[i]['A36'] >= 1 ? A36(data[i]['A36']) : ''
            );
            isifile.push(datas);
          }
        } else {
          if (data[i]['A2'] === province) {
            var datas = [];
            var dataA14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var dataA18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var dataA21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            datas.push(
              data[i]['KID_Pangkalan'],
              data[i]['NAMAPEMILIK'],
              data[i]['A1'],
              data[i]['A2'],
              data[i]['A3'],
              data[i]['KECAMATAN'],
              data[i]['KELURAHAN'],
              data[i]['A6'] >= 1 ? A6(data[i]['A6']) : '',
              data[i]['A6C'],
              data[i]['A6b'],
              data[i]['A113'] >= 1 ? A113(data[i]['A113']) : '',
              data[i]['A12'] >= 1 ? A12(data[i]['A12']) : '',
              data[i]['A13'] >= 1 ? A13(data[i]['A13']) : '',
              A14(dataA14),
              data[i]['A28'] >= 1 ? A28(data[i]['A28']) : '',
              data[i]['A29'] ? data[i]['A29'] : '',
              data[i]['A29B'],
              data[i]['A31'] >= 1 ? A31(data[i]['A31']) : '',
              A18(dataA18),
              data[i]['A33'] >= 1 ? A33(data[i]['A33']) : '',
              data[i]['A20'] >= 1 ? A20(data[i]['A20']) : '',
              A21(dataA21),
              data[i]['A35'] >= 1 ? A35(data[i]['A35']) : '',
              data[i]['A36'] >= 1 ? A36(data[i]['A36']) : ''
            );
            isifile.push(datas);
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            var datas = [];
            var dataA14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var dataA18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var dataA21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            datas.push(
              data[i]['KID_Pangkalan'],
              data[i]['NAMAPEMILIK'],
              data[i]['A1'],
              data[i]['A2'],
              data[i]['A3'],
              data[i]['KECAMATAN'],
              data[i]['KELURAHAN'],
              data[i]['A6'] >= 1 ? A6(data[i]['A6']) : '',
              data[i]['A6C'],
              data[i]['A6b'],
              data[i]['A113'] >= 1 ? A113(data[i]['A113']) : '',
              data[i]['A12'] >= 1 ? A12(data[i]['A12']) : '',
              data[i]['A13'] >= 1 ? A13(data[i]['A13']) : '',
              A14(dataA14),
              data[i]['A28'] >= 1 ? A28(data[i]['A28']) : '',
              data[i]['A29'] ? data[i]['A29'] : '',
              data[i]['A29B'],
              data[i]['A31'] >= 1 ? A31(data[i]['A31']) : '',
              A18(dataA18),
              data[i]['A33'] >= 1 ? A33(data[i]['A33']) : '',
              data[i]['A20'] >= 1 ? A20(data[i]['A20']) : '',
              A21(dataA21),
              data[i]['A35'] >= 1 ? A35(data[i]['A35']) : '',
              data[i]['A36'] >= 1 ? A36(data[i]['A36']) : ''
            );
            isifile.push(datas);
          }
        } else {
          if (data[i]['A2'] === province) {
            var datas = [];
            var dataA14 = [
              data[i]['A14_1'] > 0 && 1,
              data[i]['A14_2'] > 0 && 2,
              data[i]['A14_3'] > 0 && 3,
              data[i]['A14_4'] > 0 && 4,
              data[i]['A14_5'] > 0 && 5,
              data[i]['A14_6'] > 0 && 6,
              data[i]['A14_7'] > 0 && 7,
            ];
            var dataA18 = [
              data[i]['A18_1'] > 0 && 1,
              data[i]['A18_2'] > 0 && 2,
              data[i]['A18_3'] > 0 && 3,
              data[i]['A18_4'] > 0 && 4,
              data[i]['A18_5'] > 0 && 5,
              data[i]['A18_6'] > 0 && 6,
              data[i]['A18_7'] > 0 && 7,
              data[i]['A18_8'] > 0 && 8,
              data[i]['A18_9'] > 0 && 9,
              data[i]['A18_10'] > 0 && 10,
              data[i]['A18_11'] > 0 && 11,
              data[i]['A18_12'] > 0 && 12,
              data[i]['A18_13'] > 0 && 13,
            ];
            var dataA21 = [
              data[i]['A21_1'] > 0 && 1,
              data[i]['A21_2'] > 0 && 2,
              data[i]['A21_3'] > 0 && 3,
              data[i]['A21_4'] > 0 && 4,
              data[i]['A21_5'] > 0 && 5,
              data[i]['A21_6'] > 0 && 6,
              data[i]['A21_7'] > 0 && 7,
              data[i]['A21_8'] > 0 && 8,
              data[i]['A21_9'] > 0 && 9,
              data[i]['A21_10'] > 0 && 10,
              data[i]['A21_11'] > 0 && 11,
            ];
            datas.push(
              data[i]['KID_Pangkalan'],
              data[i]['NAMAPEMILIK'],
              data[i]['A1'],
              data[i]['A2'],
              data[i]['A3'],
              data[i]['KECAMATAN'],
              data[i]['KELURAHAN'],
              data[i]['A6'] >= 1 ? A6(data[i]['A6']) : '',
              data[i]['A6C'],
              data[i]['A6b'],
              data[i]['A113'] >= 1 ? A113(data[i]['A113']) : '',
              data[i]['A12'] >= 1 ? A12(data[i]['A12']) : '',
              data[i]['A13'] >= 1 ? A13(data[i]['A13']) : '',
              A14(dataA14),
              data[i]['A28'] >= 1 ? A28(data[i]['A28']) : '',
              data[i]['A29'] ? data[i]['A29'] : '',
              data[i]['A29B'],
              data[i]['A31'] >= 1 ? A31(data[i]['A31']) : '',
              A18(dataA18),
              data[i]['A33'] >= 1 ? A33(data[i]['A33']) : '',
              data[i]['A20'] >= 1 ? A20(data[i]['A20']) : '',
              A21(dataA21),
              data[i]['A35'] >= 1 ? A35(data[i]['A35']) : '',
              data[i]['A36'] >= 1 ? A36(data[i]['A36']) : ''
            );
            isifile.push(datas);
          }
        }
      } else {
        var datas = [];
        var dataA14 = [
          data[i]['A14_1'] > 0 && 1,
          data[i]['A14_2'] > 0 && 2,
          data[i]['A14_3'] > 0 && 3,
          data[i]['A14_4'] > 0 && 4,
          data[i]['A14_5'] > 0 && 5,
          data[i]['A14_6'] > 0 && 6,
          data[i]['A14_7'] > 0 && 7,
        ];
        var dataA18 = [
          data[i]['A18_1'] > 0 && 1,
          data[i]['A18_2'] > 0 && 2,
          data[i]['A18_3'] > 0 && 3,
          data[i]['A18_4'] > 0 && 4,
          data[i]['A18_5'] > 0 && 5,
          data[i]['A18_6'] > 0 && 6,
          data[i]['A18_7'] > 0 && 7,
          data[i]['A18_8'] > 0 && 8,
          data[i]['A18_9'] > 0 && 9,
          data[i]['A18_10'] > 0 && 10,
          data[i]['A18_11'] > 0 && 11,
          data[i]['A18_12'] > 0 && 12,
          data[i]['A18_13'] > 0 && 13,
        ];
        var dataA21 = [
          data[i]['A21_1'] > 0 && 1,
          data[i]['A21_2'] > 0 && 2,
          data[i]['A21_3'] > 0 && 3,
          data[i]['A21_4'] > 0 && 4,
          data[i]['A21_5'] > 0 && 5,
          data[i]['A21_6'] > 0 && 6,
          data[i]['A21_7'] > 0 && 7,
          data[i]['A21_8'] > 0 && 8,
          data[i]['A21_9'] > 0 && 9,
          data[i]['A21_10'] > 0 && 10,
          data[i]['A21_11'] > 0 && 11,
        ];
        datas.push(
          data[i]['KID_Pangkalan'],
          data[i]['NAMAPEMILIK'],
          data[i]['A1'],
          data[i]['A2'],
          data[i]['A3'],
          data[i]['KECAMATAN'],
          data[i]['KELURAHAN'],
          data[i]['A6'] >= 1 ? A6(data[i]['A6']) : '',
          data[i]['A6C'],
          data[i]['A6b'],
          data[i]['A113'] >= 1 ? A113(data[i]['A113']) : '',
          data[i]['A12'] >= 1 ? A12(data[i]['A12']) : '',
          data[i]['A13'] >= 1 ? A13(data[i]['A13']) : '',
          A14(dataA14),
          data[i]['A28'] >= 1 ? A28(data[i]['A28']) : '',
          data[i]['A29'] ? data[i]['A29'] : '',
          data[i]['A29B'],
          data[i]['A31'] >= 1 ? A31(data[i]['A31']) : '',
          A18(dataA18),
          data[i]['A33'] >= 1 ? A33(data[i]['A33']) : '',
          data[i]['A20'] >= 1 ? A20(data[i]['A20']) : '',
          A21(dataA21),
          data[i]['A35'] >= 1 ? A35(data[i]['A35']) : '',
          data[i]['A36'] >= 1 ? A36(data[i]['A36']) : ''
        );
        isifile.push(datas);
      }
    }

    var header = [
      [
        'ID Pangkalan',
        'Nama Pangkalan',
        'Region',
        'Provinsi',
        'Kota',
        'Kecamatan',
        'Kelurahan',
        'Keberadaan Pangkalan',
        'Alamat Baru Jika Pangkalan sudah ditemukan',
        'Alamat Jika Pindah Alamat',
        'Kepemilikan Perangkat Device Pendukung',
        'Status Boarding Pangkalan',
        'Sudah Menerima Email Dari Pertamina',
        'Alsan Belum On-Boarding Padahal Sudah Terima Email',
        'Kesesuain Email Jika Belum Terima Email',
        'Email Yang Sesuai',
        'Email Baru',
        'Keberhasilan Boarding Setelah Dibantu',
        'Alasan On Boarding Tapi Belum Transaksi',
        'Keberhasilan Transaksi Setelah Dibantu',
        'Kendala Saat Transaksi',
        'Kendala Saat Transaksi',
        'Kepemilikan Poster',
        'Poster Terlihat atau Tidak',
      ],
    ];

    var formatdate = moment().format('YYYY_MM_DD_HH_mm_ss');
    var newfilename = `${pid}_${formatdate}.xlsx`;
    var createfile = header.concat(isifile);
    const progress = xlsx.build([{ name: 'Data', data: createfile }]);
    fs.writeFile(
      `public/fileexcel/${newfilename}`,
      progress,
      function (errwritefile) {
        if (errwritefile) {
          console.log('error');
        } else {
          console.log('tidak error');
          res.status(200).json({
            statusCode: 200,
            message: 'Success export data pangkalan',
            data: `https://dashboard.kadence.co.id/fileexcel/${newfilename}`,
          });
        }
      }
    );
    // res.status(200).json({
    //   statusCode: 200,
    //   message: 'Success get touchpoint score parent',
    //   data: isifile,
    // });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getExportCity = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;
    var data = await excelData(pid);
    var isifile = [];

    var result = [];
    if (region === '0') {
      if (province === '0') {
        var _getAdminstrationCityAll = await getAdminstrationCityAll(pid);
      } else {
        if (city === '0') {
          var _getAdminstrationCityAll = await getAdminstrationCityByProvince(
            pid,
            province
          );
        } else {
          var _getAdminstrationCityAll = await getAdminstrationCityByName(
            pid,
            city
          );
        }
      }
    } else {
      if (province === '0') {
        var _getAdminstrationProvinceByRegion =
          await getAdminstrationProvinceByRegion(pid, region);
        var dataProvince = _getAdminstrationProvinceByRegion.map(
          (data) => data.provinceName
        );
        var _getAdminstrationCityAll =
          await getAdminstrationCityByArrayProvince(pid, dataProvince);
      } else {
        if (city === '0') {
          var _getAdminstrationCityAll = await getAdminstrationCityByProvince(
            pid,
            province
          );
        } else {
          var _getAdminstrationCityAll = await getAdminstrationCityByName(
            pid,
            city
          );
        }
      }
    }

    for (let i = 0; i < _getAdminstrationCityAll.length; i++) {
      result.push({
        code: _getAdminstrationCityAll[i].idCity,
        province: _getAdminstrationCityAll[i].areaName,
        cityName: _getAdminstrationCityAll[i].cityName,
        dataList: _getAdminstrationCityAll[i].dataList,
        visit: 0,
        visitPercentage: 0,
        pangkalanAktif: 0,
        tutupPermanen: 0,
        tidakDitemukan: 0,
        pindahAlamat: 0,
        tutupSaatKunjungan: 0,
        pangkalanAktif2: 0, // belum masuk
        notBoardingWithDevice: 0,
        notBoardingNoDevice: 0,
        boardingNoTransaction: 0,
        boardingTransaction: 0,
        successBoarding: 0,
        failedEmail: 0,
        failedDontWantOnBoard: 0,
        failedOthers: 0,
        boardingSuccessTransaction: 0,
        boardingFailedTransaction: 0,
        successTransaction: 0,
        failedTransaction: 0,
      });
    }

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      var findData = await findObj(result, 'cityName', data[i]['A3']);
      if (findData !== -1) {
        result[findData].visit = result[findData].visit + 1;

        //status kunjungan pangkalan
        if (data[i]['A6'] === 1) {
          result[findData].pangkalanAktif = result[findData].pangkalanAktif + 1;
        }
        if (data[i]['A6'] === 2) {
          result[findData].tutupPermanen = result[findData].tutupPermanen + 1;
        }
        if (data[i]['A6'] === 3) {
          result[findData].tidakDitemukan = result[findData].tidakDitemukan + 1;
        }
        if (data[i]['A6'] === 4) {
          result[findData].pindahAlamat = result[findData].pindahAlamat + 1;
        }
        if (data[i]['A6'] === 5) {
          result[findData].tutupSaatKunjungan =
            result[findData].tutupSaatKunjungan + 1;
        }

        // status boarding pangkalan
        if (data[i]['A113'] === 1) {
          result[findData].notBoardingWithDevice =
            result[findData].notBoardingWithDevice + 1;
        }
        if (data[i]['A113'] === 2) {
          result[findData].notBoardingNoDevice =
            result[findData].notBoardingNoDevice + 1;
        }
        if (data[i]['A12'] === 2) {
          result[findData].boardingNoTransaction =
            result[findData].boardingNoTransaction + 1;
        }
        if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
          result[findData].boardingTransaction =
            result[findData].boardingTransaction + 1;
        }

        // belum on boarding
        if (data[i]['A31'] === 1) {
          result[findData].successBoarding =
            result[findData].successBoarding + 1;
        }
        if (data[i]['A31'] === 2) {
          result[findData].failedEmail = result[findData].failedEmail + 1;
        }
        if (data[i]['A31'] === 3) {
          result[findData].failedDontWantOnBoard =
            result[findData].failedDontWantOnBoard + 1;
        }
        if (data[i]['A31'] === 4) {
          result[findData].failedOthers = result[findData].failedOthers + 1;
        }

        // transaction
        if (data[i]['A50'] === 1) {
          result[findData].boardingSuccessTransaction =
            result[findData].boardingSuccessTransaction + 1;
        }
        if (data[i]['A50'] === 2 || data[i]['A50'] === 3) {
          result[findData].boardingFailedTransaction =
            result[findData].boardingFailedTransaction + 1;
        }
        if (data[i]['A33'] === 1) {
          result[findData].successTransaction =
            result[findData].successTransaction + 1;
        }
        if (data[i]['A33'] === 2 || data[i]['A33'] === 3) {
          result[findData].failedTransaction =
            result[findData].failedTransaction + 1;
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].visit > 0) {
        result[i].visitPercentage =
          (result[i].visit / result[i].dataList) * 100;
      }
    }
    bubbleSort(result, 'visitPercentage');

    for (let i = 0; i < result.length; i++) {
      isifile.push([
        result[i].province,
        result[i].cityName,
        result[i].dataList,
        `${result[i].visitPercentage.toFixed(2)}%`,
        `${countPercent(result[i].pangkalanAktif, result[i].dataList)}%`,
        `${countPercent(result[i].tutupPermanen, result[i].dataList)}%`,
        `${countPercent(result[i].tidakDitemukan, result[i].dataList)}%`,
        `${countPercent(result[i].pindahAlamat, result[i].dataList)}%`,
        `${countPercent(result[i].tutupSaatKunjungan, result[i].dataList)}%`,
        `${countPercent(result[i].pangkalanAktif2, result[i].dataList)}%`,
        `${countPercent(result[i].notBoardingWithDevice, result[i].dataList)}%`,
        `${countPercent(result[i].notBoardingNoDevice, result[i].dataList)}%`,
        `${countPercent(result[i].boardingNoTransaction, result[i].dataList)}%`,
        `${countPercent(result[i].boardingTransaction, result[i].dataList)}%`,
        `${countPercent(result[i].successBoarding, result[i].dataList)}%`,
        `${countPercent(result[i].failedEmail, result[i].dataList)}%`,
        `${countPercent(result[i].failedDontWantOnBoard, result[i].dataList)}%`,
        `${countPercent(result[i].failedOthers, result[i].dataList)}%`,
        `${countPercent(result[i].successTransaction, result[i].dataList)}%`,
        `${countPercent(
          result[i].boardingSuccessTransaction,
          result[i].dataList
        )}%`,
        `${countPercent(
          result[i].boardingFailedTransaction,
          result[i].dataList
        )}%`,
        `${countPercent(result[i].failedTransaction, result[i].dataList)}%`,
      ]);
    }

    var header = [
      [
        'Provinsi',
        'Wilayah Penugasan',
        'Jumlah Data List',
        'Jumlah Kunjungan',
        'Pangkalan Aktif Bertemu Pemilik',
        'Tutup Permanen',
        'Tidak ditemukan',
        'Pindah Alamat',
        'Sedang tutup saat kunjungan',
        'Pangkalan Aktif Tidak Ketemu Pemilik',
        'Belum On Boarding & Memiliki Device',
        'Belum On Boarding dan Tidak Memiliki Device',
        'On boarding belum transaksi',
        'On boarding transaksi',
        'Berhasil dibantu on boarding',
        'Tidak berhasil - email salah',
        'Tidak berhasil - Pemilik tidak ingin on boarding',
        'Tidak berhasil - lainnya',
        'Berhasil transaksi',
        'tidak berhasil transaksi',
        'Berhasil transaksi',
        'tidak berhasil transaksi',
      ],
    ];

    var formatdate = moment().format('YYYY_MM_DD_HH_mm_ss');
    var newfilename = `${pid}_${formatdate}_data_province.xlsx`;
    var createfile = header.concat(isifile);
    const progress = xlsx.build([{ name: 'Data', data: createfile }]);
    fs.writeFile(
      `public/fileexcel/${newfilename}`,
      progress,
      function (errwritefile) {
        if (errwritefile) {
          console.log('error');
        } else {
          console.log('tidak error');
          res.status(200).json({
            statusCode: 200,
            message: 'Success export data pangkalan',
            data: `https://dashboard.kadence.co.id/fileexcel/${newfilename}`,
          });
        }
      }
    );
    // res.status(200).json({
    //   statusCode: 200,
    //   message: 'Success get touchpoint score parent',
    //   data: isifile,
    // });
  } catch (error) {
    res.status(400).send(error);
  }
};
