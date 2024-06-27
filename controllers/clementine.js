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
          $set: { T14: data[i].T14 },
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
