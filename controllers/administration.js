require('../lib/index');
require('../lib/administration');
require('../lib/helper');

exports.getRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    const wave = req.query.wave;
    var result = [];
    if (wave !== '0') {
      var arrArea = [];
      var _getAdminstrationCityWave = await getAdminstrationCityWave(pid, wave);
      for (let i = 0; i < _getAdminstrationCityWave.length; i++) {
        if (arrArea.indexOf(_getAdminstrationCityWave[i].idArea) === -1) {
          arrArea.push(_getAdminstrationCityWave[i].idArea);
        }
      }
      var _getAdminstrationProvinceByArray =
        await getAdminstrationProvinceByArray(pid, arrArea);

      for (let i = 0; i < _getAdminstrationProvinceByArray.length; i++) {
        var _getAdminstrationRegionByCode = await getAdminstrationRegionByCode(
          pid,
          _getAdminstrationProvinceByArray[i].regionName
        );
        var findArray = await findObj(
          result,
          'code',
          _getAdminstrationRegionByCode[0].regionCode
        );
        if (findArray === -1) {
          result.push({
            value: _getAdminstrationRegionByCode[0].idRegion,
            code: _getAdminstrationRegionByCode[0].regionCode,
            label: _getAdminstrationRegionByCode[0].regionName,
          });
        }
      }
    } else {
      var data = await getAdminstrationRegion(pid);
      for (let i = 0; i < data.length; i++) {
        result.push({
          value: data[i].idRegion,
          code: data[i].regionCode,
          label: data[i].regionName,
        });
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration Region',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getProvinces = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const wave = req.query.wave;
    var result;
    if (wave !== '0') {
      var arrArea = [];
      var _getAdminstrationCityWave = await getAdminstrationCityWave(pid, wave);
      for (let i = 0; i < _getAdminstrationCityWave.length; i++) {
        if (arrArea.indexOf(_getAdminstrationCityWave[i].idArea) === -1) {
          arrArea.push(_getAdminstrationCityWave[i].idArea);
        }
      }
      var result = await getAdminstrationProvinceByRegionArrayProvince(
        pid,
        region,
        arrArea
      );
    } else {
      var result = await getAdminstrationProvinceByRegion(pid, region);
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

exports.getCityListAll = async function (req, res) {
  try {
    const pid = req.params.pid;

    var _getAdminstrationProvince = await getAdminstrationCityAll(pid);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration City',
      data: _getAdminstrationProvince,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCityListProvince = async function (req, res) {
  try {
    const pid = req.params.pid;
    const province = req.params.province;
    const wave = req.query.wave;
    var result;
    if (wave !== '0') {
      result = await getAdminstrationCityByProvinceWave(pid, province, wave);
    } else {
      result = await getAdminstrationCityByProvince(pid, province);
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration City By Province',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCityTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const wave = req.query.wave;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = 0;

    if (wave !== '0') {
      if (region !== '0' && province === '0' && city === '0') {
        var _getAdminstrationProvince = await getAdminstrationProvinceByRegion(
          pid,
          region
        );
        for (let i = 0; i < _getAdminstrationProvince.length; i++) {
          var _getAdminstrationCityByProvince =
            await getAdminstrationCityByProvinceWave(
              pid,
              _getAdminstrationProvince[i].provinceName,
              wave
            );
          result = result + _getAdminstrationCityByProvince.length;
        }
      } else if (region !== '0' && province !== '0' && city === '0') {
        var _getAdminstrationCityByProvince =
          await getAdminstrationCityByProvinceWave(pid, province, wave);
        result = _getAdminstrationCityByProvince.length;
      } else if (region !== '0' && province !== '0' && city !== '0') {
        result = 1;
      } else {
        var data = await getAdminstrationCityWave(pid, wave);
        result = data.length;
      }
    } else {
      if (region !== '0' && province === '0' && city === '0') {
        var _getAdminstrationProvince = await getAdminstrationProvinceByRegion(
          pid,
          region
        );
        for (let i = 0; i < _getAdminstrationProvince.length; i++) {
          var _getAdminstrationCityByProvince =
            await getAdminstrationCityByProvince(
              pid,
              _getAdminstrationProvince[i].provinceName
            );
          result = result + _getAdminstrationCityByProvince.length;
        }
      } else if (region !== '0' && province !== '0' && city === '0') {
        var _getAdminstrationCityByProvince =
          await getAdminstrationCityByProvince(pid, province);
        result = _getAdminstrationCityByProvince.length;
      } else if (region !== '0' && province !== '0' && city !== '0') {
        result = 1;
      } else {
        var _getAdminstrationProvince = await getAdminstrationCityAll(pid);
        result = _getAdminstrationProvince.length;
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration City By Province',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHelperTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const wave = req.query.wave;
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;
    var data;
    var result = 0;

    if (wave !== '0') {
      if (region !== '0') {
        if (province !== '0') {
          if (city !== '0') {
            data = await helperByWaveRegionProvinceCity(
              wave,
              region,
              province,
              city
            );
          } else {
            data = await helperByWaveRegionProvince(wave, region, province);
          }
        } else {
          data = await helperByWaveRegion(wave, region);
        }
      } else {
        data = await helperByWave(wave);
      }
    } else {
      if (region !== '0') {
        if (province !== '0') {
          if (city !== '0') {
            data = await helperByCity(city);
          } else {
            data = await helperByProvince(province);
          }
        } else {
          data = await helperByRegion(region);
        }
      } else {
        data = await helperAll();
      }
    }

    for (let i = 0; i < data.length; i++) {
      result = result + data[i].total;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Helper',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSensusAll = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = await getAdministrationSensusAll(pid);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Helper',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSensusLatLong = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = await getAdministrationSensusLatLong(pid);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Helper',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getSensusDetailByID = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = req.params.id;
    var result = await getAdministrationSensusById(pid, id);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Helper',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getDirectorateList = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = await getAdminstrationDirectorateList(pid);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Directorate List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getDirectorateDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = req.params.id;
    var result = await getAdminstrationDirectorate(pid, id);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Directorate Detail',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPanelList = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    var result = await getAdminstrationPanelList(pid, directorate);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Panel List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPanelDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = req.params.id;
    var result = await getAdminstrationPanelDetail(pid, id);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Panel Detail',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
