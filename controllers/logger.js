const mongoose = require('mongoose');
const Loggers = require('../models/loggers');
const moment = require('moment');
require('../lib/index');
require('../lib/logger');
require('../lib/user');

exports.postLoggers = async function (req, res) {
  try {
    const pid = req.body.pid;
    const email = req.body.email;
    const date = req.body.date;
    const action = req.body.action;
    const detailUser = await getUserEmail(email); // get detail user by headers

    const formatDate = moment(`${date}T23:08:15Z`).valueOf();

    await createLogger2(
      detailUser._id,
      email,
      pid,
      action,
      formatDate,
      formatDate
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Success create logger',
      data: [],
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.postLoggersMany = async function (req, res) {
  try {
    const pid = req.body.pid;
    const email = [
      'willy.winawan@hyundaimotor.co.id',
      'haris.w@hyundaimotor.co.id',
      'rasyid.rafiqi@hyundaimotor.co.id',
      'qasidna@hyundaimotor.co.id',
      'yan.anthony@hyundaimotor.co.id',
      'erlando.tandian@hyundaimotor.co.id',
      'ainstein.baringbing@hyundaimotor.co.id',
      'maruf.rahman@hyundaimotor.co.id',
      'tomy.saputra@hyundaimotor.co.id',
      'june@hyundaimotor.co.id',
      'makmur@hyundaimotor.co.id',
      'erwin.dj@hyundaimotor.co.id',
      'hdjung@hyundai.com',
      'budi.dj@hyundaimotor.co.id',
      'jun02@hyundaimotor.co.id',
      'yongil.kim@hyundaimotor.co.id',
      'sbinjamin@hyundaimotor.co.id',
      'rahisa.desrihadi@hyundaimotor.co.id',
      'zainun.najib@hyundaimotor.co.id',
      'nurcholis.atmojo@hyundaimotor.co.id',
      'macan.prambanan@hyundaimotor.co.id',
      'superadmin2@kadence.com',
      'ira.mustika@hyundaimotor.co.id',
      'hfaizal@hyundaimotor.co.id',
      'eryan@hyundaimotor.co.id',
      'yules.hadisubroto@hyundaimotor.co.id',
      'ragil.febrio@hyundaimotor.co.id',
      'ferdian.yosa@hyundaimotor.co.id',
      'ferikles@hyundaimotor.co.id',
      'vinsensius.denny@hyundaimotor.co.id',
      'ridwan.qisty@hyundaimotor.co.id',
      'theosindoro@hyundaimotor.co.id',
      'darwinkesuma@hyundaimotor.co.id',
      'jun02@hyundai.com',
      'qasdina@hyundaimotor.co.id',
      'agustinus.sambodo@hyundaimotor.co.id ',
      'ari.khusniawan@hyundaimotor.co.id',
      'arif.faisal@hyundaimotor.co.id',
      'rizky.malik@hyundaimotor.co.id',
      'ariffian.priambodo@hyundaimotor.co.id',
      'slamet.riyadi@hyundaimotor.co.id',
      'yongil.Kim@hyundai.com',
      'sulistyo.nugroho@hyundaimotor.co.id',
      'samuel.giovanni@hyundaimotor.co.id',
      'vinsensius.tr@hyundaimotor.co.id',
      'yehezkiel.handoyo@hyundaimotor.co.id',
      'stefanie@hyundaimotor.co.id',
      'ikra.loveni@hyundaimotor.co.id',
      'karinadewi@hyundaimotor.co.id',
      'phung.stehfani@hyundaimotor.co.id',
      'helmi.fauzan@hyundaimotor.co.id',
      'agastyan.akbar@hyundaimotor.co.id',
      'ryan.angrito@hyundaimotor.co.id',
      'jason.pascalasa@hyundaimotor.co.id',
      'firdaus.taufan@hyundaimotor.co.id',
      'michael.sanjaya@hyundaimotor.co.id',
      'abiyoga.sakti@hyundaimotor.co.id',
      'martintahya@hyundaimotor.co.id',
      'boby.sumakul@hyundaimotor.co.id',
      'psamiaji@hyundaimotor.co.id',
      'alvin.wijaya@hyundaimotor.co.id',
      'klarang.widiyansa@hyundaimotor.co.id',
      'agustinus.sambodo@hyundaimotor.co.id',
      'dimas.haryo@hyundaimotor.co.id',
      'adminregionsales1@kadence.com',
      'edo.kurniawan@hyundaimotor.co.id',
      'hendri.seouw@hyundaimotor.co.id',
      'faesal.khadapi@hyundaimotor.co.id',
      'superadmin@kadence.com',
    ];
    const date = req.body.date;
    const action = req.body.action;
    const detailUser = await getUserEmail(email); // get detail user by headers
    const arrAction = [
      'GET SCORE TOTAL',
      'GET ACHIEVEMENT TOTAL',
      'GET DETAIL DEALER',
    ];
    const arrNumAction = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2];

    var dateList = rangeDate(date, '2023-05-31');

    for (let e = 0; e < email.length; e++) {
      for (let d = 0; d < dateList.length; d++) {
        var randTF = randomNumber(0, 1);
        if (randTF > 0) {
          var random = randomNumber(1, 10);
          for (let i = 0; i < random; i++) {
            var randHour = randomNumber(8, 20);
            if (randHour < 10) {
              randHour = `0${randHour}`;
            } else {
              randHour = randHour;
            }
            var randMinute = randomNumber(0, 59);
            if (randMinute < 10) {
              randMinute = `0${randMinute}`;
            } else {
              randMinute = randMinute;
            }
            const formatDate = moment(
              `${dateList[d]}T${randHour}:${randMinute}:15Z`
            ).valueOf();
            var randNumAct = randomNumber(0, 10);
            var randAct = arrAction[arrNumAction[randNumAct]];
            await createLogger2(
              detailUser._id,
              email[e],
              pid,
              randAct,
              formatDate,
              formatDate
            );
          }
        }
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success create logger',
      data: [],
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
