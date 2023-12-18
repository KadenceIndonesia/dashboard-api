require('../lib/dataExcel');
require('../lib/index');
require('../lib/branch');

exports.getBranchList = async function (req, res) {
  try {
    var pid = req.params.pid;
    var page = req.query.page;
    var perPage = req.query.perPage;
    var tags = req.query.tags;
    var result = await getBranchList(pid, tags, page, perPage);
    res.status(200).send({
      statusCode: 200,
      message: 'Success get list branch',
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      statusCode: 404,
      message: 'Error',
    });
  }
};

exports.getBranchListCompareWithData = async function (req, res) {
  try {
    var pid = req.params.pid;
    var page = parseInt(req.query.page);
    var perPage = parseInt(req.query.perPage);
    var tags = req.query.tags;
    var rawdata = req.query.rawdata;
    var result = [];
    var _getBranchList = await getBranchList(pid, tags, page, perPage);
    var data = tags ? await excelDataSubDir(pid, tags) : await excelData(pid);

    for (let i = 0; i < _getBranchList.length; i++) {
      var _findObj = await findObj(data, rawdata, _getBranchList[i].rawdata);
      if (_findObj !== -1) {
        result.push({
          SbjNum: data[_findObj]['SbjNum'],
          branch: _getBranchList[i].branch,
          city: _getBranchList[i].city,
          key: _getBranchList[i].key,
          agent: data[_findObj]['NamaAgent'],
          leader: data[_findObj]['NamaLeader'],
          date: excelDatetoJS(data[_findObj].TglKunjungan),
          storage: _getBranchList[i].storage || 'kepo'
        });
      }
    }
    res.status(200).send({
      statusCode: 200,
      message: 'Success get list branch',
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      statusCode: 404,
      message: 'Error',
    });
  }
};

exports.getBranchDetailByRawdata = async function (req, res) {
  try {
    var pid = req.params.pid;
    var rawdata = req.params.rawdata;
    var result = await getBranchByRawdata(pid, rawdata);
    res.status(200).send({
      statusCode: 200,
      message: 'Success get branch detail',
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      statusCode: 404,
      message: 'Error',
    });
  }
};
