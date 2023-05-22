require('../lib/index');
require('../lib/administration');
require('../lib/dataExcel');

const A6Code = [
  { code: 1, label: 'Pangkalan aktif/ beroperasi' },
  { code: 2, label: 'Pangkalan tidak aktif (tutup permanen)' },
  { code: 3, label: 'Pangkalan tidak dapat ditemukan' },
  { code: 4, label: 'Pangkalan pindah alamat' },
  {
    code: 5,
    label:
      'Pangkalan sedang tutup (hanya tutup sementara/ tutup saat kunjungan saja)',
  },
];

const A114Code = [
  { code: 1, label: 'Smartphone' },
  { code: 2, label: 'Tablet' },
  { code: 3, label: 'PC' },
  { code: 4, label: 'Laptop' },
];

exports.getVisitAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [];
    var data = await excelData(pid);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: data.length,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStatusVisitAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;
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
      if (parseInt(province) !== 0 && parseInt(city) === 0) {
        if (data[i]['A2'] === province) {
          result[data[i]['A6'] - 1].value = result[data[i]['A6'] - 1].value + 1;
        }
      } else if (parseInt(province) !== 0 && parseInt(city) !== 0) {
        if (data[i]['A3'] === city) {
          result[data[i]['A6'] - 1].value = result[data[i]['A6'] - 1].value + 1;
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
        }
      } else if (parseInt(province) !== 0 && parseInt(city) === 0) {
        if (data[i]['A3'] === city) {
          result[data[i]['A114'] - 1].count =
            result[data[i]['A114'] - 1].count + 1;
        }
      } else {
        result[data[i]['A114'] - 1].count =
          result[data[i]['A114'] - 1].count + 1;
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
