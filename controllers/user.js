const mongoose = require('mongoose');
const User = require('../models/user');

global.getUserByEmail = function (email, pid) {
  return new Promise((resolve) => {
    User.find({ email: email, projectID: pid })
      .exec()
      .then((result) => {
        resolve(result);
      });
  });
};

exports.postCreateUser = async function (req, res) {
  const createUser = new User({
    _id: new mongoose.Types.ObjectId(),
    projectID: req.body.pid,
    username: req.body.nama,
    email: req.body.email,
    password: req.body.password,
    status: req.body.status,
    role: req.body.role,
    access: req.body.role,
  });
  createUser
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));
  res.status(201).json({
    message: 'success',
    createdUser: createUser,
  });
};

exports.getUser = async function (req, res) {
  var email = req.params.email;
  var pid = req.params.pid;
  var getuser = await getUserByEmail(email, pid);
};
