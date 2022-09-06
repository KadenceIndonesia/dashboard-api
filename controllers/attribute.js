const mongoose = require('mongoose');
const Attribute = require('../models/attributes');

exports.createAttribute = async function (req, res) {
  const attribute = new Attribute({
    _id: new mongoose.Types.ObjectId(),
    projectID: req.body.pid,
    questionID: req.body.qid,
    type: req.body.type,
    attribute: req.body.attribute,
    grouping: req.body.grouping,
    loopLabel: req.body.loopLabel,
  });
  attribute
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));
  res.status(201).json({
    message: 'success',
    data: attribute,
  });
};
