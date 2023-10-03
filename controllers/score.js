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

exports.getScoreAverageGrid = async function (req, res) {
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
    var result = [];
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    for (let i = 0; i < attribute.attribute.length; i++) {
      result.push({
        label: attribute.attribute[i].label,
        code: `T_${qidx}_${attribute.attribute[i].code}`,
        total: 0,
        score: 0,
      });
    }
    var data = await excelData(pid);
    if (project.length > 0) {
      if (attribute) {
        for (let x = 0; x < data.length; x++) {
          if (data[x]['SbjNum'] !== -1 && filterLogic(x)) {
            for (let i = 0; i < result.length; i++) {
              result[i].total = result[i].total + data[x][result[i].code];
            }
            total++;
          }
        }
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
      }

      for (let i = 0; i < result.length; i++) {
        result[i].score = decimalPlaces(result[i].total / total, 2);
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
exports.getScoreAverageByAttributeGrid = async function (req, res) {
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
    var attribute = await attributeByQidx(pid, qidx);
    var result = [];
    for (let i = 0; i < attribute.attribute.length; i++) {
      var value = [];
      for (let x = 0; x < getattributebypid[0].attribute.length; x++) {
        value.push({
          code: getattributebypid[0].attribute[x].code,
          label: getattributebypid[0].attribute[x].label,
          total: 0,
          count: 0,
          score: 0,
        });
      }
      result.push({
        code: `T_${qidx}_${attribute.attribute[i].code}`,
        label: attribute.attribute[i].label,
        value: value,
      });
    }

    const project = await projectByPid(pid);
    if (project.length > 0) {
      var data = await excelData(pid);
      if (attribute) {
        for (let x = 0; x < data.length; x++) {
          for (let i = 0; i < result.length; i++) {
            var findFromAttr = await findObj(
              result[i].value,
              'code',
              data[x][attr]
            );
            if (
              data[x]['SbjNum'] !== -1 &&
              filterLogic(x) &&
              findFromAttr !== -1
            ) {
              result[i].value[findFromAttr].count++;
              result[i].value[findFromAttr].total =
                result[i].value[findFromAttr].total + data[x][result[i].code];
            }
          }
        }

        for (let i = 0; i < result.length; i++) {
          for (let x = 0; x < result[i].value.length; x++) {
            if (result[i].value[x].count > 0) {
              result[i].value[x].score = decimalPlaces(
                result[i].value[x].total / result[i].value[x].count,
                2
              );
            } else {
              result[i].value[x].score = 0;
            }
          }
        }
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
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
