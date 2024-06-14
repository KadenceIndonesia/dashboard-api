const express = require('express');
const Router = express();
const User = require('../models/user');
const Loggers = require('../models/loggers');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const moment = require('moment-timezone');
const enc = new Cryptr('kadence');

global.getUserByEmail = function (email) {
  return new Promise((resolve) => {
    User.find({ email: email })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
global.getProjectInUsers = function (email, pid) {
  return new Promise((resolve) => {
    User.find({ email: email, projectID: { $in: pid } })
      .exec()
      .then((result) => {
        resolve(result);
      });
  });
};

Router.post('/register', async function (req, res, next) {
  var emailBody = req.body.email;
  var pid = req.body.pid;
  const encryptPass = enc.encrypt(req.body.password);

  var getUser = await getUserByEmail(emailBody);
  if (getUser.length == 0) {
    const createUser = new User({
      _id: new mongoose.Types.ObjectId(),
      project: req.body.pid,
      username: req.body.username,
      email: req.body.email,
      password: encryptPass,
      status: req.body.status,
      access: req.body.access,
      role: req.body.role,
    });
    createUser
      .save()
      .then((result) => {
        res.status(201).send({
          message: 'success',
          createdUser: result,
        });
      })
      .catch((err) => {
        // failed create email
        res.status(404).json({
          message: 'failed',
        });
      });
  } else {
    var assigned = getUser[0].projectID.indexOf(pid);
    //check if email already assign to project
    if (assigned != -1) {
      res.status(409).json({
        message: 'Assigned',
      });
    } else {
      // push new projectID
      var updateProjectID = getUser[0].projectID;
      updateProjectID.push(pid);
      User.updateOne(
        { email: emailBody },
        { $set: { projectID: updateProjectID } }
      )
        .exec()
        .then((result) => {
          res.status(200).json({
            message: 'update pid',
          });
        });
    }
  }
});
Router.post('/login', async function (req, res) {
  var email = req.body.email;
  var pass = req.body.password;
  var pid = req.body.pid;
  var getUser = await getUserByEmail(email);
  var getprojectinusers = await getProjectInUsers(email, pid);
  if (getUser.length > 0) {
    var decrypt = enc.decrypt(getUser[0].password);
    if (pass == decrypt) {
      if (getprojectinusers.length > 0) {
        const createLogger = new Loggers({
          _id: new mongoose.Types.ObjectId(),
          user: getUser[0]._id,
          project: pid,
          email: req.body.email,
          action: 'LOGIN USER',
          createdDate: moment(),
          createdTime: moment(),
        });
        createLogger
          .save()
          .then((result) => {
            res.status(200).json({
              message: 'success',
              login: [
                {
                  id: getUser[0]._id,
                  pid: pid,
                  email: email,
                  username: getUser[0].username,
                  access: getUser[0].access,
                  role: getUser[0].role,
                },
              ],
            });
          })
          .catch((err) => {
            // failed create email
            res.status(404).json({
              message: 'failed',
            });
          });
      } else {
        res.status(401).json({
          message: 'not assigned',
        });
      }
    } else {
      res.status(401).json({
        message: 'invalid password',
      });
    }
  } else {
    res.status(404).json({
      message: 'email not found',
    });
  }
});

module.exports = Router;
