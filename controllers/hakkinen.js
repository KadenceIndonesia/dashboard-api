const mongoose = require('mongoose');
const Video = require('../models/videos');
const moment = require('moment');
exports.testController = async function (req, res) {
  try {
    const pid = req.params.pid;

    res.status(200).send({
      statusCode: 200,
      data: 'success',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.postDurationUpdate = async function (req, res) {
  try {
    const pid = req.params.pid;
    const type = req.body.type;
    let duration = parseInt(req.body.duration);
    let idRespondent = parseInt(req.body.idRespondent);

    const create = new Video({
      _id: new mongoose.Types.ObjectId(),
      idProject: pid,
      idResponent: idRespondent,
      type: type,
      duration: duration,
      date: moment(),
    });
    create
      .save()
      .then((result) => {
        res.status(200).json({
          message: 'success save video duration',
          data: result,
        });
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(400).send(error);
  }
};
