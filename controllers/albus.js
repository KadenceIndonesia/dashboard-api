require('../lib/index');
require('../lib/dataExcel');
require('../lib/branch');

exports.testController = async function (req, res) {
  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success test albus',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.rawdataServicePoint = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [];
    var data = await excelDataSubDir(pid, 'service_point');

    for (let i = 0; i < data.length; i++) {
      var _getBranchByRawdata = await getBranchByRawdata(pid, data[i]['S0']);
      result.push({
        SbjNum: data[i].SbjNum,
        branch: _getBranchByRawdata.branch,
        city: _getBranchByRawdata.city,
        date: excelDatetoJS(data[i]['TglKunjungan']),
        agent: data[i]['NamaAgent'],
        storage: data[i]['storage'],
        key:
          data[i]['storage'] === 'kepo'
            ? data[i]['key']
            : _getBranchByRawdata.key,
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success getrawdata service point',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
