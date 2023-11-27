require('../lib/index');

exports.getSpeechToTextTest = async function (req, res) {
  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success get Target',
      data: 'this is test',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
