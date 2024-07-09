const moment = require('moment');
require('../lib/dataExcel');
require('../lib/shoko');

exports.getIndexShoko = async function (req, res) {
  try {
    res.send('success');
  } catch (error) {
    res.send('error');
  }
};

global.getDatesInRange = function (startDate, endDate) {
  return new Promise((resolve) => {
    const startDateMoment = moment(startDate);
    const endDateMoment = moment(endDate);
    const dates = [];

    let currentDateMoment = startDateMoment;
    while (currentDateMoment.isSameOrBefore(endDateMoment)) {
      dates.push(currentDateMoment.toDate()); // Convert to Date object
      currentDateMoment.add(1, 'day'); // Increment date by 1 day
    }
    resolve(dates);
  });
};

exports.getUserList = async function (req, res) {
  try {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    var result = [];
    var _getUserList = await getUserList({ page: page, perPage: perPage });
    var _getUserListCount = await getUserListCount();
    var arrUser = [];

    var rangeDate = await getDatesInRange(startDate, endDate);
    for (let i = 0; i < _getUserList.length; i++) {
      arrUser.push(_getUserList[i]._id.user);
      var countDate = [];
      for (let x = 0; x < rangeDate.length; x++) {
        countDate.push({
          date: moment(rangeDate[x]).format('YYYY-MM-DD'),
          count: 0,
        });
      }
      result.push({
        user: _getUserList[i]._id.user,
        username: _getUserList[i]._id.username,
        date: countDate,
      });
    }
    var _countJourneyUserByDate = await countJourneyUserByDate({
      user: arrUser,
      startDate: startDate,
      endDate: endDate,
    });
    for (let i = 0; i < result.length; i++) {
      for (let x = 0; x < _countJourneyUserByDate.length; x++) {
        if (result[i].user === _countJourneyUserByDate[x]._id.user) {
          for (let z = 0; z < result[i].date.length; z++) {
            if (
              moment(_countJourneyUserByDate[x]._id.date).format(
                'YYYY-MM-DD'
              ) === result[i].date[z].date
            ) {
              result[i].date[z].count = _countJourneyUserByDate[x].count;
            }
          }
        }
      }
    }

    res.send({
      message: 'success get user list',
      data: result,
      total: _getUserListCount,
    });
  } catch (error) {
    res.send('error user');
  }
};

exports.getUserListJourney = async function (req, res) {
  try {
    const user = req.params.user;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    var result = await getUserJourneyList({
      user: user,
      page: page,
      perPage: perPage,
    });
    var total = await getUserJourneyCount({ user: user });
    res.send({
      message: 'success get journey list user',
      data: result,
      total: total,
    });
  } catch (error) {
    res.send(result);
  }
};

exports.getJourneyDetail = async function (req, res) {
  try {
    const id = req.params.id;
    var result = await getJourneyDetailById({ id: id });

    res.send({
      message: 'success get journey',
      data: result,
    });
  } catch (error) {
    res.send(result);
  }
};

exports.getJourneyCountUser = async function (req, res) {
  try {
    const user = req.query.user;
    const city = req.query.city;
    var userId = await getListUserAll({ user, city });
    var arrUserId = userId.map((data) => data._id);
    var result = await getJourneyTodayUser({ user: arrUserId });
    res.send({
      message: 'success get journey count user',
      data: result.length,
    });
  } catch (error) {
    res.send(result);
  }
};

exports.getCountUserRegister = async function (req, res) {
  try {
    const user = req.query.user;
    const city = req.query.city;
    var result = await countUserRegister({ city, user });
    res.send({
      message: 'success get user register',
      data: result,
    });
  } catch (error) {
    res.send(result);
  }
};

exports.getMonitoringUserList = async function (req, res) {
  try {
    const user = req.query.user;
    const city = req.query.city;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    var result = await getListUser({
      user: user,
      city: city,
      page: page,
      perPage: perPage,
    });
    var count = await countUserData({ user: user, city: city });
    for (let i = 0; i < result.length; i++) {
      const getJourney = await countJourneyUserToday({
        user: result[i]._id,
      });
      result[i].journey = getJourney.length;
      if (getJourney.length > 0) {
        if (getJourney[getJourney.length - 1].endDate) {
          result[i].progress = 'finish';
        } else {
          result[i].progress = 'in progress';
        }
      }else{
        result[i].progress = 'not start';
      }
    }
    res.send({
      message: 'success get user list',
      data: result,
      totalData: count,
    });
  } catch (error) {
    res.send(error);
  }
};
