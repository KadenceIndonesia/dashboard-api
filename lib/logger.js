const mongoose = require('mongoose');
const Loggers = require('../models/loggers');
const moment = require('moment-timezone');

global.createLogger = function (user, email, pid, action) {
  return new Promise((resolve) => {
    const createLogger = new Loggers({
      _id: new mongoose.Types.ObjectId(),
      user: user,
      project: pid,
      email: email,
      action: action,
      createdDate: moment(),
      createdTime: moment(),
    });
    createLogger
      .save()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

global.createLogger2 = function (user, email, pid, action, date, time) {
  return new Promise((resolve) => {
    const createLogger = new Loggers({
      _id: new mongoose.Types.ObjectId(),
      user: user,
      project: pid,
      email: email,
      action: action,
      createdDate: date,
      createdTime: time,
    });
    createLogger
      .save()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        resolve(err);
      });
  });
};
