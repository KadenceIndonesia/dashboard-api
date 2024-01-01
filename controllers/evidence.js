require('../lib/index');
require('../lib/celestia');

exports.getEvidenceTest = async function (req, res) {
  try {
    const pid = req.params.pid;
    res.status(200).json({
      statusCode: 200,
      message: 'Success test evidence',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEvidenceList = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = parseInt(req.params.id);
    var result = [];
    var _getEvidenceByID = await getEvidenceByID(pid, id);
    for (let i = 0; i < _getEvidenceByID.length; i++) {
      result.push({
        _id: _getEvidenceByID[i]._id,
        SbjNum: _getEvidenceByID[i].SbjNum,
        file: {
          completedUrl: _getEvidenceByID[i].link,
        },
        idProject: _getEvidenceByID[i].idProject,
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get Evidence List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEvidenceListByNumber = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = req.params.id;
    var result = [];
    var data = await getEvidenceByNumber(pid, id);
    for (let i = 0; i < data.length; i++) {
      result.push({
        _id: data[i]._id,
        SbjNum: data[i].SbjNum,
        file: {
          completedUrl: data[i].link,
        },
        idProject: data[i].idProject,
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get Evidence List',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEvidenceDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = req.params.id;
    var _getEvidenceDetail = await getEvidenceDetail(pid, id);
    var result = {
      _id: _getEvidenceDetail._id,
      file: {
        completedUrl: _getEvidenceDetail.link,
      },
      type: 'VIDEO',
    };
    res.status(200).json({
      statusCode: 200,
      message: 'Success get Evidence detail',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
