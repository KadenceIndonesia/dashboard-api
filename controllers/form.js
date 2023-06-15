require('../lib/index');
const Touchpointscore = require('../models/touchpointscore');

exports.getForm = async function (req, res) {
  res.send('form');
};

exports.postUploadScoreHyundai = async function (req, res, next) {
  let uploadPath;
  var pid = req.body.pid;
  var filename = req.files.rawdata;
  uploadPath = `public/formUpload/${filename}`;
  filename.mv(uploadPath, function (errupload) {
    if (errupload) {
      res.send('error');
    } else {
      res.send('success');
    }
  });

  res.send(pid);
};

exports.readRawdataHyundai = async function (req, res, next) {
  const pid = req.query.pid;
  var data = await excelData(pid);
  var result = [];
  for (let i = 0; i < data.length; i++) {
    Touchpointscore.updateOne(
      {
        dealerName: data[i]['dealerName'],
        code: data[i]['code'],
        idProject: data[i]['idProject'],
      },
      { $set: { score: decimalPlaces(data[i]['score'], 2) } }
    )
      .exec()
      .then((result) => {
        var a = { dealerName: data[i]['dealerName'], code: data[i]['code'] };
      });
  }

  res.status(200).json({
    statusCode: 200,
    message: 'Success get Sort Poster',
    data: result,
  });
};
