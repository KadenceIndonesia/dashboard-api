require("../lib/index");
require("dotenv").config();

exports.getTopbreak = async function (req, res) {
  try {
    const pid = await projectByPid(req.params.pid);
    if (pid.length > 0) {
      res.status(200).send(pid);
    } else {
      res.status(404).send({
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTopbreakByQidx = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const project = await projectByPid(req.params.pid);
    var topbreak = (await projectByPid(pid))[0].topbreak;
    var findOnObject = await findObj(topbreak, "quest", qidx);
    if (project.length > 0) {
      if (findOnObject != -1) {
        res.status(200).send(topbreak[findOnObject]);
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

exports.getTopbreakAttributes = async function (req, res) {
  try {
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    const project = await projectByPid(req.params.pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        res.status(200).send(attribute);
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
