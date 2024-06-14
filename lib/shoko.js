const Routes = require('../models/routes');

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
