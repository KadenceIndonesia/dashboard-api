require('../lib/administration');
require('../lib/helper');

exports.getProvinces = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;

    // if (region === '0' || region === undefined) {
    //   var _getAdminstrationProvince = await getAdminstrationProvince(pid);
    // } else {
    var _getAdminstrationProvince = await getAdminstrationProvinceByRegion(
      pid,
      region
    );
    // }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: _getAdminstrationProvince,
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

    var _getAdminstrationProvince = await getAdminstrationCityByProvince(
      pid,
      province
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration City By Province',
      data: _getAdminstrationProvince,
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
