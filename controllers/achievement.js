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
                y: 0
            })
        }
        for (let i = 0; i < data.length; i++) {
            var findOnObject = await findObj(rawdata, "code", data[i][qidx]);
            rawdata[findOnObject].y++
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
