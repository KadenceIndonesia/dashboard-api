require('../lib/administration');

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
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = 0;

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
    const region = req.query.region;
    const province = req.query.province;
    const city = req.query.city;

    var result = 0;

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
        for (let x = 0; x < _getAdminstrationCityByProvince.length; x++) {
          result = result + _getAdminstrationCityByProvince[x].others;
        }
      }
    } else if (region !== '0' && province !== '0' && city === '0') {
      var _getAdminstrationCityByProvince =
        await getAdminstrationCityByProvince(pid, province);
      for (let i = 0; i < _getAdminstrationCityByProvince.length; i++) {
        result = result + _getAdminstrationCityByProvince[i].others;
      }
      result = _getAdminstrationCityByProvince.length;
    } else if (region !== '0' && province !== '0' && city !== '0') {
      var _getAdminstrationCityByName = await getAdminstrationCityByName(
        pid,
        city
      );
      result = _getAdminstrationCityByName[0].others;
    } else {
      var _getAdminstrationProvince = await getAdminstrationCityAll(pid);
      for (let i = 0; i < _getAdminstrationProvince.length; i++) {
        result = result + _getAdminstrationProvince[i].others;
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
