require('../lib/administration');

exports.getVisitAchievement = async function (req, res) {
  try {
    const pid = req.params.pid;

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Administration provinces',
      data: '',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
