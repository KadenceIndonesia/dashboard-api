require('../lib/administration');

exports.getProvinces = async function (req, res) {
  try {
    const pid = req.params.pid;

    var _getAdminstrationProvince = await getAdminstrationProvince(pid);

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
