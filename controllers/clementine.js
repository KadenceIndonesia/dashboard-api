const Clementine = require('../models/clementine');

require('../lib/clementine');
require('../lib/attribute');
require('../lib/dataExcel');
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

exports.getTotalRespondent = async function (req, res) {
  try {
    const age = req.query.age;
    const ses = req.query.ses;
    const city = req.query.city;
    const gender = req.query.gender;

    var result = await getRespondent({ age, city, ses, gender });
    console.log(result)

    res.status(200).json({
      statusCode: 200,
      message: 'Success get response clementine',
      data: result,
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

exports.getResponseFilterMultiple = async function (req, res) {
  try {
    console.log('multiple');
    const pid = req.query.pid;
    const age = req.query.age;
    const ses = req.query.ses;
    const city = req.query.city;
    const gender = req.query.gender;
    const question = req.query.question;
    // var result = await getResponse({
    //   age,
    //   ses,
    //   city,
    //   gender,
    //   question,
    // });
    var attribute = await getAttributeList({
      pid: pid,
      qidx: question,
    });
    var result = [];
    for (let i = 0; i < attribute.attribute.length; i++) {
      var _countResponseInArrayMultiple = await countResponseInArrayMultiple({
        pid: pid,
        age,
        ses,
        city,
        gender,
        question: question,
        value: `${attribute.attribute[i].code}`,
      });
      result.push({
        _id: attribute.attribute[i].code,
        name: attribute.attribute[i].label,
        y: _countResponseInArrayMultiple,
      });
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

exports.getImportDataMulti = async function (req, res) {
  try {
    const pid = req.query.pid;
    var data = await excelData(pid);
    for (let i = 0; i < data.length; i++) {
      var dataSplit = data[i].T15.split(',');
      console.log(data[i].T15);
      Clementine.updateOne(
        {
          id: data[i].id,
        },
        {
          $set: { T15: dataSplit },
        }
      )
        .exec()
        .then((result) => console.log('success'))
        .catch((error) => console.log(error));
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success import',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getImportDataSingle = async function (req, res) {
  try {
    const pid = req.query.pid;
    var data = await excelData(pid);
    for (let i = 0; i < data.length; i++) {
      Clementine.updateOne(
        {
          id: data[i].id,
        },
        {
          $set: { A5: data[i].A5 },
        }
      )
        .exec()
        .then((result) => console.log('success'))
        .catch((error) => console.log(error));
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success import',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getBei = async function (req, res) {
  try {
    const age = req.query.age;
    const ses = req.query.ses;
    const city = req.query.city;
    const gender = req.query.gender;
    var result = await getResponseBei({
      age,
      ses,
      city,
      gender,
    });
    res.status(200).json({
      statusCode: 200,
      message: 'Success get BEI clementine',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getNps = async function (req, res) {
  try {
    const pid = req.query.pid;
    const age = req.query.age;
    const ses = req.query.ses;
    const city = req.query.city;
    const gender = req.query.gender;
    const question = req.query.question;
    var result = [];
    var attribute = await getAttributeList({
      pid: pid,
      qidx: question,
    });

    for (let i = 0; i < attribute.attribute.length; i++) {
      var _getResponseNps = await getResponseNps({
        age,
        ses,
        city,
        gender,
        question,
        value: `${attribute.attribute[i].code}`,
      });
      var detractors = 0;
      var passives = 0;
      var promoters = 0;
      for (let j = 0; j < _getResponseNps.length; j++) {
        if (parseInt(_getResponseNps[j].A5) <= 6) {
          detractors++;
        } else if (
          parseInt(_getResponseNps[j].A5) >= 7 &&
          parseInt(_getResponseNps[j].A5) <= 8
        ) {
          passives++;
        } else if (parseInt(_getResponseNps[j].A5) >= 9) {
          promoters++;
        }
      }

      result.push({
        code: attribute.attribute[i].code,
        name: attribute.attribute[i].label,
        detractors: countPercent(detractors, _getResponseNps.length),
        passives: countPercent(passives, _getResponseNps.length),
        promoters: countPercent(promoters, _getResponseNps.length),
        nps:
          countPercent(promoters, _getResponseNps.length) -
          countPercent(detractors, _getResponseNps.length),
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get NPS clementine',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOverall = async function (req, res) {
  try {
    const pid = req.query.pid;
    const age = req.query.age;
    const ses = req.query.ses;
    const city = req.query.city;
    const gender = req.query.gender;
    const question = req.query.question;
    const questionOverall = req.query.questionOverall;
    var result = await getResponseOverall({
      age,
      ses,
      city,
      gender,
      question,
      questionOverall,
    });

    var attribute = await getAttributeList({
      pid: pid,
      qidx: question,
    });

    for (let i = 0; i < result.length; i++) {
      var find = await findObj(
        attribute.attribute,
        'code',
        parseInt(result[i]._id.code)
      );
      result[i] = {
        ...result[i],
        name: attribute.attribute[find].label,
      };
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get overall clementine',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
