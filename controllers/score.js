require('../lib/dataExcel');
require('../lib/index');

exports.getScoreAverageByAttribute = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const attr = req.params.attr;
    var total = 0;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    var getattributebypid = await getAttributesByPid(pid, attr);
    var result = [];
    for (let i = 0; i < getattributebypid[0].attribute.length; i++) {
      result.push({
        code: getattributebypid[0].attribute[i].code,
        label: getattributebypid[0].attribute[i].label,
        total: 0,
        count: 0,
        score: 0,
      });
    }

    const project = await projectByPid(pid);
    if (project.length > 0) {
      var data = await excelData(pid);
      for (let x = 0; x < data.length; x++) {
        var findFromAttr = await findObj(result, 'code', data[x][attr]);
        if (data[x]['SbjNum'] !== -1 && filterLogic(x) && findFromAttr !== -1) {
          result[findFromAttr].count++;
          result[findFromAttr].total =
            result[findFromAttr].total + data[x][qidx];
          total++;
        }
      }
      for (let i = 0; i < result.length; i++) {
        if (result[i].count > 0) {
          result[i].score = decimalPlaces(result[i].total / result[i].count, 2);
        } else {
          result[i].score = 0;
        }
      }

      res.status(200).send({
        projectID: pid,
        projectName: project[0].projectName,
        message: 'Success get score average',
        data: result,
      });
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreAverage = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    var total = 0;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    var result = {
      total: 0,
      count: 0,
      score: 0,
    };

    const project = await projectByPid(pid);
    if (project.length > 0) {
      var data = await excelData(pid);
      for (let x = 0; x < data.length; x++) {
        if (data[x]['SbjNum'] !== -1 && filterLogic(x)) {
          result.count++;
          result.total = result.total + data[x][qidx];
          total++;
        }
      }

      result.score = decimalPlaces(result.total / result.count, 2);

      res.status(200).send({
        projectID: pid,
        projectName: project[0].projectName,
        message: 'Success get score average',
        total: result,
      });
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
