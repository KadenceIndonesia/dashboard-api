require('../lib/index');
require('../lib/vehicle');
exports.testController = async function (req, res) {
  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success test vehicle',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getVehicleList = async function (req, res) {
  try {
    const pid = req.params.pid;
    const city = req.query.city;
    const province = req.query.province;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const search = req.query.search;

    var result = await vehicleList(pid, city, province, search, page, perPage);
    var totalData = await vehicleListAll(pid, city, province, search);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get vehicle list',
      totalData: totalData,
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getVehicleDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const number = req.params.number;

    var result = await vehicleDetailByNumber(pid, number)

    res.status(200).json({
      statusCode: 200,
      message: 'Success get vehicle list',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
