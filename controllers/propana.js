require('../lib/index');
require('../lib/administration');
require('../lib/dataExcel');

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
          result[data[i]['A6'] - 1].value = result[data[i]['A6'] - 1].value + 1;
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            result[data[i]['A6'] - 1].value =
              result[data[i]['A6'] - 1].value + 1;
          }
        } else {
          if (data[i]['A2'] === province) {
            result[data[i]['A6'] - 1].value =
              result[data[i]['A6'] - 1].value + 1;
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            result[data[i]['A6'] - 1].value =
              result[data[i]['A6'] - 1].value + 1;
          }
        } else {
          if (data[i]['A2'] === province) {
            result[data[i]['A6'] - 1].value =
              result[data[i]['A6'] - 1].value + 1;
          }
        }
      } else {
        result[data[i]['A6'] - 1].value = result[data[i]['A6'] - 1].value + 1;
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
          result[data[i]['A6'] - 1].count = result[data[i]['A6'] - 1].count + 1;
          total++;
        }
      } else if (region !== '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            result[data[i]['A6'] - 1].count =
              result[data[i]['A6'] - 1].count + 1;
            total++;
          }
        } else {
          if (data[i]['A2'] === province) {
            result[data[i]['A6'] - 1].count =
              result[data[i]['A6'] - 1].count + 1;
            total++;
          }
        }
      } else if (region === '0' && province !== '0') {
        if (city !== '0') {
          if (data[i]['A3'] === city) {
            result[data[i]['A6'] - 1].count =
              result[data[i]['A6'] - 1].count + 1;
            total++;
          }
        } else {
          if (data[i]['A2'] === province) {
            result[data[i]['A6'] - 1].count =
              result[data[i]['A6'] - 1].count + 1;
            total++;
          }
        }
      } else {
        result[data[i]['A6'] - 1].count = result[data[i]['A6'] - 1].count + 1;
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
              count: 0,
            });
          } else {
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
                count: 0,
              });
            } else {
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
                count: 0,
              });
            } else {
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
                count: 0,
              });
            } else {
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
                count: 0,
              });
            } else {
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
            count: 0,
          });
        } else {
          if (data[i]['A35'] === 1) {
            result[findCity].count = result[findCity].count + 1;
          }
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      var findIndexCity = await findObj(_getCity, 'cityName', result[i].label);
      result[i].value = (result[i].count / _getCity[findIndexCity].list) * 100;
      result[i].value = decimalPlaces(result[i].value, 2);
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
            result[2].value = result[1].value + 1;
          }
          if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
            result[3].value = result[1].value + 1;
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
              result[2].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[1].value + 1;
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
              result[2].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[1].value + 1;
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
              result[2].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[1].value + 1;
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
              result[2].value = result[1].value + 1;
            }
            if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
              result[3].value = result[1].value + 1;
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
          result[2].value = result[1].value + 1;
        }
        if (data[i]['A12'] === 3 || data[i]['A12'] === 4) {
          result[3].value = result[1].value + 1;
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
              count: 0,
              value: 0,
            });
          } else {
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
                count: 0,
                value: 0,
              });
            } else {
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
                count: 0,
                value: 0,
              });
            } else {
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
                count: 0,
                value: 0,
              });
            } else {
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
                count: 0,
                value: 0,
              });
            } else {
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
            count: 0,
            value: 0,
          });
        } else {
          if (data[i]['A31'] === 1) {
            result[findCity].count = result[findCity].count + 1;
          }
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      var findIndexCity = await findObj(_getCity, 'cityName', result[i].label);
      result[i].value = (result[i].count / _getCity[findIndexCity].list) * 100;
      result[i].value = decimalPlaces(result[i].value, 2);
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

    // if (province !== '0') {
    //   var _getAdminstrationCityAll = await getAdminstrationCityByProvince(
    //     pid,
    //     province
    //   );
    // } else {
    //   var _getAdminstrationCityAll = await getAdminstrationCityAll(pid);
    // }

    for (let i = 0; i < _getAdminstrationCityAll.length; i++) {
      result.push({
        code: _getAdminstrationCityAll[i].idCity,
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

      // if (parseInt(province) !== 0 && parseInt(city) === 0) {
      //   if (data[i]['A2'] === province) {
      //     result.push({
      //       province: data[i]['A2'],
      //       city: data[i]['A3'],
      //       key: data[i]['KID_KEPO'],
      //       pangkalan: data[i]['NAMAPEMILIK'],
      //       kecamatan: data[i]['KECAMATAN'],
      //       kelurahan: data[i]['KELURAHAN'],
      //     });
      //   }
      // } else if (parseInt(province) !== 0 && parseInt(city) !== 0) {
      //   if (data[i]['A3'] === city) {
      //     result.push({
      //       province: data[i]['A2'],
      //       city: data[i]['A3'],
      //       key: data[i]['KID_KEPO'],
      //       pangkalan: data[i]['NAMAPEMILIK'],
      //       kecamatan: data[i]['KECAMATAN'],
      //       kelurahan: data[i]['KELURAHAN'],
      //     });
      //   }
      // } else {
      //   if (data[i]['A113'] === 1) {
      //     result.push({
      //       province: data[i]['A2'],
      //       city: data[i]['A3'],
      //       key: data[i]['KID_KEPO'],
      //       pangkalan: data[i]['NAMAPEMILIK'],
      //       kecamatan: data[i]['KECAMATAN'],
      //       kelurahan: data[i]['KELURAHAN'],
      //     });
      //   }
      // }
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
