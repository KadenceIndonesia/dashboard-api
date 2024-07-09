const Routes = require('../models/routes');
const { shoko } = require('../config/db');

global.getUserList = function ({ page, perPage }) {
  return new Promise((resolve) => {
    Routes.aggregate([
      {
        $group: {
          _id: {
            user: '$user',
            username: '$username',
          },
        },
      },
      {
        $skip: page * perPage,
      },
      {
        $limit: perPage ? perPage : 10,
      },
    ])
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.countJourneyUserByDate = function ({ user, startDate, endDate }) {
  return new Promise((resolve) => {
    Routes.aggregate([
      {
        $match: {
          user: { $in: user },
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: {
            user: '$user',
            journey: '$journey',
            date: '$date',
          },
          count: { $sum: 1 },
        },
      },
    ])
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getUserListCount = function () {
  return new Promise((resolve) => {
    Routes.aggregate([
      {
        $group: {
          _id: {
            user: '$user',
          },
        },
      },
    ])
      .exec()
      .then((result) => {
        resolve(result.length);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getUserJourneyList = function ({ user, page, perPage }) {
  return new Promise((resolve) => {
    Routes.aggregate([
      {
        $match: {
          user: user,
        },
      },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: {
            journey: '$journey',
            date: '$date',
          },
          count: { $sum: 1 },
        },
      },
      {
        $skip: page * perPage,
      },
      {
        $limit: perPage ? perPage : 10,
      },
    ])
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getUserJourneyCount = function ({ user }) {
  return new Promise((resolve) => {
    Routes.aggregate([
      {
        $match: {
          user: user,
        },
      },
      {
        $group: {
          _id: {
            journey: '$journey',
          },
        },
      },
    ])
      .exec()
      .then((result) => {
        resolve(result.length);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getJourneyDetailById = function ({ id }) {
  return new Promise((resolve) => {
    Routes.aggregate([
      {
        $match: {
          journey: id,
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field if not needed
          latitude: 1,
          longitude: 1,
        },
      },
      {
        $addFields: {
          lat: '$latitude',
          lng: '$longitude',
        },
      },
    ])
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getJourneyTodayUser = async function ({ user }) {
  return new Promise(async (resolve) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const result = await shoko
      .collection('journeys')
      .aggregate([
        {
          $match: {
            startDate: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
            user: { $in: user },
          },
        },
        {
          $group: {
            _id: '$user',
            count: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();
    resolve(result);
  });
};

global.countUserRegister = async function ({ city, user }) {
  return new Promise(async (resolve) => {
    const result = await shoko.collection('users').countDocuments({
      alreadyProfile: true,
      city: city === '0' || !city ? { $ne: null } : city,
      username: user === '0' || !user ? { $ne: null } : user,
    });
    resolve(result);
  });
};

global.getListUser = async function ({ user, city, page, perPage }) {
  return new Promise(async (resolve) => {
    const result = await shoko
      .collection('users')
      .aggregate([
        {
          $match: {
            city: city === '0' || !city ? { $ne: null } : city,
            username: user === '0' || !user ? { $ne: null } : user,
            alreadyProfile: true,
          },
        },
        {
          $skip: perPage ? page * perPage : page * 10,
        },
        {
          $limit: perPage ? perPage : 10,
        },
      ])
      .toArray();
    resolve(result);
  });
};

global.getListUserAll = async function ({ user, city }) {
  return new Promise(async (resolve) => {
    const result = await shoko
      .collection('users')
      .aggregate([
        {
          $match: {
            city: city === '0' || !city ? { $ne: null } : city,
            username: user === '0' || !user ? { $ne: null } : user,
            alreadyProfile: true,
          },
        },
      ])
      .toArray();
    resolve(result);
  });
};

global.countUserData = async function ({ user, city }) {
  return new Promise(async (resolve) => {
    const result = await shoko.collection('users').countDocuments({
      city: city === '0' || !city ? { $ne: null } : city,
      username: user === '0' || !user ? { $ne: null } : user,
      alreadyProfile: true,
    });
    resolve(result);
  });
};

global.countJourneyUserToday = async function ({ user }) {
  return new Promise(async (resolve) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const result = await shoko
      .collection('journeys')
      .aggregate([
        {
          $match: {
            startDate: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
            user: user,
          },
        },
      ])
      .toArray();
    resolve(result);
  });
};
