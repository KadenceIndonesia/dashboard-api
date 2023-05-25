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

    var result = [];
    if (parseInt(province) !== 0) {
      var _getAdminstrationCityAll = await getAdminstrationCityByProvince(
        pid,
        province
      );
    } else {
      var _getAdminstrationCityAll = await getAdminstrationCityAll(pid);
    }

    for (let i = 0; i < _getAdminstrationCityAll.length; i++) {
      result.push({
        code: _getAdminstrationCityAll[i].idCity,
        cityName: _getAdminstrationCityAll[i].cityName,
        dataList: _getAdminstrationCityAll[i].dataList,
        visit: 0,
        visitPercentage: 0,
      });
    }

    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      var findData = await findObj(result, 'cityName', data[i]['A3']);
      if (findData !== -1) {
        result[findData].visit = result[findData].visit + 1;
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
    const province = req.query.province;
    const city = req.query.city;

    var data = await excelData(pid);
    var result = [];

    for (let i = 0; i < data.length; i++) {
      if (parseInt(province) !== 0 && parseInt(city) === 0) {
        if (data[i]['A2'] === province) {
          var findDevice = await findObj(
            A114Code,
            'code',
            parseInt(data[i]['A114'])
          );
          result.push({
            province: data[i]['A2'],
            city: data[i]['A3'],
            key: data[i]['KID_KEPO'],
            device: A114Code[findDevice].label,
            pangkalan: data[i]['NAMAPEMILIK'],
            kecamatan: data[i]['KECAMATAN'],
            kelurahan: data[i]['KELURAHAN'],
          });
        }
      } else if (parseInt(province) !== 0 && parseInt(city) !== 0) {
        if (data[i]['A3'] === city) {
          var findDevice = await findObj(
            A114Code,
            'code',
            parseInt(data[i]['A114'])
          );
          result.push({
            province: data[i]['A2'],
            city: data[i]['A3'],
            key: data[i]['KID_KEPO'],
            device: A114Code[findDevice].label,
            pangkalan: data[i]['NAMAPEMILIK'],
            kecamatan: data[i]['KECAMATAN'],
            kelurahan: data[i]['KELURAHAN'],
          });
        }
      } else {
        if (data[i]['A113'] === 1) {
          var findDevice = await findObj(
            A114Code,
            'code',
            parseInt(data[i]['A114'])
          );
          result.push({
            province: data[i]['A2'],
            city: data[i]['A3'],
            key: data[i]['KID_KEPO'],
            device: A114Code[findDevice].label,
            pangkalan: data[i]['NAMAPEMILIK'],
            kecamatan: data[i]['KECAMATAN'],
            kelurahan: data[i]['KELURAHAN'],
          });
        }
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
