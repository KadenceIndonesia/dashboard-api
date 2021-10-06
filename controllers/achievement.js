require("../lib/dataExcel");
require("../lib/index");

exports.getAchievementData = async function (req, res) {
  try {
    const pid = req.params.pid;
    const project = await projectByPid(pid);
    if (project.length > 0) {
      var data = await excelData(pid);
      res.status(200).send({
        projectID: pid,
        projectName: project[0].projectName,
        total: data.length,
      });
    } else {
      res.status(404).send({
        messages: "Project not found",
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
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        for (let i = 0; i < attribute.attribute.length; i++) {
          rawdata.push({
            code: attribute.attribute[i].code,
            label: attribute.attribute[i].label,
            y: 0,
          });
        }
        for (let i = 0; i < data.length; i++) {
          var findOnObject = await findObj(rawdata, "code", data[i][qidx]);
          rawdata[findOnObject].y++;
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: "Question not found",
        });
      }
    } else {
      res.status(404).send({
        messages: "Project not found",
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
        if (code1 != "") {
          return data[i][break1] == code1;
        } else {
          return " ";
        }
      };

      const filterLogic = (i) => {
        if (code2 != "" && code3 == "") {
          return data[i][break2] == code2;
        } else if (code2 == "" && code3 != "") {
          return data[i][break3] == code3;
        } else if (code2 != "" && code3 != "") {
          return data[i][break2] == code2 && data[i][break3] == code3;
        } else {
          return " ";
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
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
