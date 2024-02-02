const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');
require('../lib/score');
require('../lib/dataExcel');
require('../lib/vehicle');
exports.testController = async function (req, res) {
  try {
    const pid = 'IDE3576';
    var header = [['number', 'SbjNum', 'link', 'idProject', 'idPanel']];

    var data = await vehicleListAllDrive(pid);
    var result = [];
    for (let i = 0; i < data.length; i++) {
      var _getFileonFolder = await getFileonFolder(data[i].number);
      if (_getFileonFolder.length > 0) {
        for (let x = 0; x < _getFileonFolder.length; x++) {
          result.push([
            data[i].number,
            data[i].SbjNum,
            _getFileonFolder[x],
            pid,
            0,
          ]);
        }
      }
    }

    var formatdate = moment().format('YYYY_MM_DD_HH_mm_ss');
    var newfilename = `${pid}_${formatdate}_list.xlsx`;
    var createfile = header.concat(result);
    console.log(createfile);
    const progress = xlsx.build([{ name: 'Data', data: createfile }]);
    fs.writeFile(
      `public/fileexcel/${newfilename}`,
      progress,
      function (errwritefile) {
        if (errwritefile) {
          console.log('error');
        } else {
          console.log('tidak error');
          res.status(200).json({
            statusCode: 200,
            message: 'Success export',
            data: `http://localhost:3333/fileexcel/${newfilename}`,
          });
        }
      }
    );

    // res.status(200).json({
    //   statusCode: 200,
    //   message: 'Success get vehicle list',
    //   data: result,
    // });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreCountry = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [];
    var data = await scoreCountry(pid);
    result.push({
      name: 'Indonesia',
      data: [0, 0, 0, 0, 0],
    });
    for (let i = 0; i < data.length; i++) {
      result.push({
        name: data[i]._id.country,
        data: [
          data[i].score,
          data[i].logo,
          data[i].typography,
          data[i].color,
          data[i].imageStyle,
          data[i].graphicSystem,
        ],
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreCountryRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [
      {
        name: 'Indonesia',
        region: '',
      },
      {
        name: 'Thailand',
        region: [],
      },
      {
        name: 'Philippines',
        region: [],
      },
      {
        name: 'Vietnam',
        region: [],
      },
    ];

    for (let i = 0; i < result.length; i++) {
      var _scoreRegion = await scoreRegion(pid, result[i].name);
      if (_scoreRegion.length > 0) {
        result[i].region = _scoreRegion;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreCountryChannel = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [
      {
        name: 'Indonesia',
        channel: '',
      },
      {
        name: 'Thailand',
        channel: [],
      },
      {
        name: 'Philippines',
        channel: [],
      },
      {
        name: 'Vietnam',
        channel: [],
      },
    ];

    for (let i = 0; i < result.length; i++) {
      var _scoreCountryChannel = await scoreCountryChannel(pid, result[i].name);
      if (_scoreCountryChannel.length > 0) {
        result[i].channel = _scoreCountryChannel;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreChannel = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [];
    var data = await scoreChannel(pid);
    for (let i = 0; i < data.length; i++) {
      result.push({
        name: data[i]._id.channel,
        data: [
          data[i].score,
          data[i].logo,
          data[i].typography,
          data[i].color,
          data[i].imageStyle,
          data[i].graphicSystem,
        ],
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
