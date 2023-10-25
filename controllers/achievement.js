require('../lib/dataExcel');
require('../lib/index');

exports.getAchievementData = async function (req, res) {
  try {
    const pid = req.params.pid;
    const subdir = req.query.subdir;
    var total = 0;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        // 1
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        // 1,2
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        //1,2,3
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        //2
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        //2,3
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        //3
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        //1,3
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    if (project.length > 0) {
      var data = subdir
        ? await excelDataSubDir(pid, subdir)
        : await excelData(pid);
      for (let x = 0; x < data.length; x++) {
        if (data[x]['SbjNum'] !== -1 && filterLogic(x)) {
          total++;
        }
      }
      res.status(200).send({
        projectID: pid,
        projectName: project[0].projectName,
        total: total,
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

exports.achievementByQidx = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        // 1
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        // 1,2
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        //1,2,3
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        //2
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        //2,3
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        //3
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        //1,3
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        if (attribute.type === 'SA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
            });
          }
          console.log(rawdata);
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              var findOnObject = await findObj(
                rawdata,
                'code',
                parseInt(data[x][qidx])
              );
              if (findOnObject !== -1) {
                rawdata[findOnObject].y++;
              }
            }
          }
        } else if (attribute.type === 'MA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              for (let y = 1; y <= attribute.attribute.length; y++) {
                var findOnObject = await findObj(
                  rawdata,
                  'code',
                  parseInt(data[x][`${qidx}_O${y}`])
                );
                if (findOnObject !== -1) {
                  rawdata[findOnObject].y++;
                }
              }
            }
          }
        } else if (attribute.type === 'GRIDSA') {
          for (let i = 0; i < attribute.loopLabel.length; i++) {
            var rawdataAnswer = [];
            for (let i = 0; i < attribute.attribute.length; i++) {
              rawdataAnswer.push({
                code: attribute.attribute[i].code,
                label: attribute.attribute[i].label,
                y: 0,
              });
            }
            for (let x = 0; x < data.length; x++) {
              if (filterLogic(x)) {
                var findOnObject = await findObj(
                  rawdataAnswer,
                  'code',
                  parseInt(data[x][`T_${qidx}_${attribute.loopLabel[i].code}`])
                );
                if (findOnObject !== -1) {
                  rawdataAnswer[findOnObject].y++;
                }
              }
            }
            rawdata.push({
              code: attribute.loopLabel[i].code,
              label: attribute.loopLabel[i].label,
              y: rawdataAnswer,
            });
          }
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.achievementByQidxPercentTarget = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        // 1
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        // 1,2
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        //1,2,3
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        //2
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        //2,3
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        //3
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        //1,3
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        if (attribute.type === 'SA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
              percent: 0,
              base: attribute.attribute[i].target,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              var findOnObject = await findObj(
                rawdata,
                'code',
                parseInt(data[x][qidx])
              );
              if (findOnObject !== -1) {
                rawdata[findOnObject].y++;
                rawdata[findOnObject].percent =
                  (rawdata[findOnObject].y * 100) / rawdata[findOnObject].base;
              }
            }
          }
        } else if (attribute.type === 'MA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              for (let y = 1; y <= attribute.attribute.length; y++) {
                var findOnObject = await findObj(
                  rawdata,
                  'code',
                  parseInt(data[x][`${qidx}_O${y}`])
                );
                if (findOnObject !== -1) {
                  rawdata[findOnObject].y++;
                }
              }
            }
          }
        } else if (attribute.type === 'GRIDSA') {
          for (let i = 0; i < attribute.loopLabel.length; i++) {
            var rawdataAnswer = [];
            for (let i = 0; i < attribute.attribute.length; i++) {
              rawdataAnswer.push({
                code: attribute.attribute[i].code,
                label: attribute.attribute[i].label,
                y: 0,
              });
            }
            for (let x = 0; x < data.length; x++) {
              if (filterLogic(x)) {
                var findOnObject = await findObj(
                  rawdataAnswer,
                  'code',
                  parseInt(data[x][`T_${qidx}_${attribute.loopLabel[i].code}`])
                );
                if (findOnObject !== -1) {
                  rawdataAnswer[findOnObject].y++;
                }
              }
            }
            rawdata.push({
              code: attribute.loopLabel[i].code,
              label: attribute.loopLabel[i].label,
              y: rawdataAnswer,
            });
          }
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.achievementByQidxPercentTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        // 1
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        // 1,2
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        //1,2,3
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        //2
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        //2,3
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        //3
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        //1,3
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        var total = 0;
        if (attribute.type === 'SA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
              percent: 0,
              base: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              total++;
              var findOnObject = await findObj(
                rawdata,
                'code',
                parseInt(data[x][qidx])
              );
              if (findOnObject !== -1) {
                rawdata[findOnObject].y++;
              }
            }
          }
        } else if (attribute.type === 'MA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
              percent: 0,
              base: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              total++;
              for (let y = 1; y <= attribute.attribute.length; y++) {
                var findOnObject = await findObj(
                  rawdata,
                  'code',
                  parseInt(data[x][`${qidx}_O${y}`])
                );
                if (findOnObject !== -1) {
                  rawdata[findOnObject].y++;
                }
              }
            }
          }
        } else if (attribute.type === 'GRIDSA') {
          for (let i = 0; i < attribute.loopLabel.length; i++) {
            var rawdataAnswer = [];
            for (let i = 0; i < attribute.attribute.length; i++) {
              rawdataAnswer.push({
                code: attribute.attribute[i].code,
                label: attribute.attribute[i].label,
                y: 0,
                percent: 0,
                base: 0,
              });
            }
            for (let x = 0; x < data.length; x++) {
              if (filterLogic(x)) {
                var findOnObject = await findObj(
                  rawdataAnswer,
                  'code',
                  parseInt(data[x][`T_${qidx}_${attribute.loopLabel[i].code}`])
                );
                if (findOnObject !== -1) {
                  rawdataAnswer[findOnObject].y++;
                }
              }
            }
            rawdata.push({
              code: attribute.loopLabel[i].code,
              label: attribute.loopLabel[i].label,
              y: rawdataAnswer,
            });
          }
        }
        for (let i = 0; i < rawdata.length; i++) {
          rawdata[i].percent = decimalPlaces((rawdata[i].y * 100) / total, 2);
          rawdata[i].base = total;
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// grouping belum bisa dipakai untuk general case
exports.achievementByQidxGrouping = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        // 1
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        // 1,2
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        //1,2,3
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        //2
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        //2,3
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        //3
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        //1,3
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    var grouping = await groupingByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        var total = 0;
        if (attribute.type === 'MA') {
          for (let i = 0; i < grouping.length; i++) {
            rawdata.push({
              code: grouping[i].code,
              label: grouping[i].label,
              y: 0,
              percent: 0,
              base: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x)) {
              // var indexOfRawdata = -1;
              var tempData = [];
              for (let y = 1; y <= attribute.attribute.length; y++) {
                var findOnObject = await findObj(
                  attribute.attribute,
                  'code',
                  parseInt(data[x][`${qidx}_O${y}`])
                );
                if (findOnObject !== -1) {
                  tempData.push(parseInt(data[x][`${qidx}_O${y}`]));
                  // for (let z = 0; z < grouping.length; z++) {
                  // var isExist = grouping[z].group.indexOf(
                  //   parseInt(data[x][`${qidx}_O${y}`])
                  // );
                  // if (isExist !== -1) {
                  //   indexOfRawdata = z;
                  //   break;
                  // }
                  // }
                }
              }
              if (tempData.indexOf(2)) {
                total++;
                rawdata[0].y++;
              } else {
                total++;
                rawdata[1].y++;
              }
            }
          }
        }
        for (let i = 0; i < rawdata.length; i++) {
          rawdata[i].percent = (rawdata[i].y * 100) / total;
          rawdata[i].base = total;
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.achievementByQidxAgeGroup = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var rawdata = [];
        var total = 0;
        for (let i = 0; i < attribute.attribute.length; i++) {
          rawdata.push({
            code: attribute.attribute[i].code,
            label: `${attribute.attribute[i].label} Tahun`,
            y: 0,
            percent: 0,
            total: 0,
          });
        }
        var data = await excelData(pid);
        for (let i = 0; i < data.length; i++) {
          total++;
          var _groupingAge = groupingAge(attribute.attribute, data[i][qidx]);
          rawdata[_groupingAge].y++;
        }
        for (let i = 0; i < rawdata.length; i++) {
          rawdata[i].percent = (rawdata[i].y * 100) / total;
          rawdata[i].base = total;
        }
        res.send(rawdata);
      } else {
        res.status(404).send({
          messages: 'Question Not Found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.achievementByQidxAgeGroupAverage = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var rawdata = [];
        var total = 0;

        var data = await excelData(pid);
        for (let i = 0; i < data.length; i++) {
          total = total + data[i][qidx];
        }
        var avg = total / data.length;
        res.send({
          project: pid,
          average: parseInt(avg.toFixed(0)),
        });
      } else {
        res.status(404).send({
          messages: 'Question Not Found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.achievementByTopbreak = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    var break1 = req.query.break1;
    var code1 = req.query.code1;
    var break2 = req.query.break2;
    var code2 = req.query.code2;
    var break3 = req.query.break3;
    var code3 = req.query.code3;
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    var countData = 0;
    if (project.length > 0) {
      var data = await excelData(pid);
      const filterBreak1 = (i) => {
        if (code1) {
          return data[i][break1] == code1;
        } else {
          return ' ';
        }
      };

      const filterLogic = (i) => {
        if (code2 && !code3) {
          return data[i][break2] == code2;
        } else if (!code2 && code3) {
          return data[i][break3] == code3;
        } else if (code2 && code3) {
          return data[i][break2] == code2 && data[i][break3] == code3;
        } else {
          return ' ';
        }
      };
      for (let i = 0; i < data.length; i++) {
        if (filterBreak1(i) && filterLogic(i)) {
          countData++;
        }
      }
      res.status(200).send({
        projectID: pid,
        projectName: project[0].projectName,
        total: countData,
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

exports.achievementByFilter = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filter = req.params.filter;
    const value = req.params.value;
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        // 1
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        // 1,2
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        //1,2,3
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        //2
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        //2,3
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        //3
        return data[x][break3] == code3;
      } else if (code1 && !code2 && code3) {
        //1,3
        return data[x][break1] == code1 && data[x][break3] == code3;
      } else {
        return true;
      }
    };
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        if (attribute.type === 'SA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
            });
          }
          for (let i = 0; i < data.length; i++) {
            if (
              data[i][qidx] != -1 &&
              data[i][filter] == parseInt(value) &&
              filterLogic(i)
            ) {
              // taro di sini
              var findOnObject = await findObj(rawdata, 'code', data[i][qidx]);
              rawdata[findOnObject].y++;
            }
          }
        } else if (attribute.type === 'MA') {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            for (let y = 1; y <= attribute.attribute.length; y++) {
              var findOnObject = await findObj(
                rawdata,
                'code',
                parseInt(data[x][`${qidx}_O${y}`])
              );
              if (findOnObject !== -1 && data[x][filter] == parseInt(value)) {
                rawdata[findOnObject].y++;
              }
            }
          }
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: 'Question not found',
        });
      }
    } else {
      res.status(404).send({
        messages: 'Project not found',
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
