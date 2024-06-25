require('../lib/clementine');
require('../lib/attribute');
exports.getIndex = async function (req, res) {
  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success test clementine',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getResponseFilter = async function (req, res) {
  try {
    const pid = req.query.pid;
    const age = req.query.age;
    const ses = req.query.ses;
    const city = req.query.city;
    const gender = req.query.gender;
    const question = req.query.question;

    var result = await getResponse({
      age,
      ses,
      city,
      gender,
      question,
    });
    var attribute = await getAttributeList({
      pid: pid,
      qidx: question,
    });

    for (let i = 0; i < result.length; i++) {
      var find = await findObj(
        attribute.attribute,
        'code',
        parseInt(result[i]._id)
      );
      result[i] = {
        ...result[i],
        name: attribute.attribute[find].label,
      };
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get response clementine',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};