const Score = require('../models/score');

global.scoreCountry = function (pid) {
  return new Promise((resolve) => {
    Score.aggregate([
      {
        $match: {
          idProject: pid,
        },
      },
      {
        $group: {
          _id: {
            country: '$country',
          },
          score: { $avg: '$score' },
          logo: { $avg: '$logo' },
          typography: { $avg: '$typography' },
          color: { $avg: '$color' },
          imageStyle: { $avg: '$imageStyle' },
          graphicSystem: { $avg: '$graphicSystem' },
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

global.scoreRegion = function (pid, country) {
  return new Promise((resolve) => {
    Score.aggregate([
      {
        $match: {
          idProject: pid,
          country: country,
        },
      },
      {
        $group: {
          _id: {
            region: '$region',
          },
          score: { $avg: '$score' },
          logo: { $avg: '$logo' },
          typography: { $avg: '$typography' },
          color: { $avg: '$color' },
          imageStyle: { $avg: '$imageStyle' },
          graphicSystem: { $avg: '$graphicSystem' },
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

global.scoreCountryChannel = function (pid, country) {
  return new Promise((resolve) => {
    Score.aggregate([
      {
        $match: {
          idProject: pid,
          country: country,
        },
      },
      {
        $group: {
          _id: {
            channel: '$channel',
            idChannel: '$idChannel',
          },
          score: { $avg: '$score' },
          logo: { $avg: '$logo' },
          typography: { $avg: '$typography' },
          color: { $avg: '$color' },
          imageStyle: { $avg: '$imageStyle' },
          graphicSystem: { $avg: '$graphicSystem' },
        },
      },
      {
        $sort: {
          '_id.idChannel': 1,
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

global.scoreChannel = function (pid) {
  return new Promise((resolve) => {
    Score.aggregate([
      {
        $match: {
          idProject: pid,
        },
      },
      {
        $group: {
          _id: {
            channel: '$channel',
            idChannel: '$idChannel',
          },
          score: { $avg: '$score' },
          logo: { $avg: '$logo' },
          typography: { $avg: '$typography' },
          color: { $avg: '$color' },
          imageStyle: { $avg: '$imageStyle' },
          graphicSystem: { $avg: '$graphicSystem' },
        },
      },
      {
        $sort: {
          '_id.idChannel': 1,
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
