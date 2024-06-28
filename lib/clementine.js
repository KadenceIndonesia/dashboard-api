const Clementine = require('../models/clementine');
const Brandindex = require('../models/brandindex');

global.getRespondent = function ({ age, ses, city, gender }) {
  return new Promise((resolve) => {
    Clementine.countDocuments({
      S2a: age !== '0' ? age : { $ne: null },
      S6: ses !== '0' ? { $in: ses } : { $ne: null },
      S0d: city !== '0' ? city : { $ne: null },
      S1: gender !== '0' ? gender : { $ne: null },
    })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getResponse = function ({ age, ses, city, gender, question }) {
  return new Promise((resolve) => {
    Clementine.aggregate([
      {
        $match: {
          S2a: age !== '0' ? age : { $ne: null },
          S6: ses !== '0' ? { $in: ses } : { $ne: null },
          S0d: city !== '0' ? city : { $ne: null },
          S1: gender !== '0' ? gender : { $ne: null },
        },
      },
      {
        $group: {
          _id: { $toInt: `$${question}` },
          y: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
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

global.countResponseInArrayMultiple = function ({
  age,
  ses,
  city,
  gender,
  question,
  value,
}) {
  return new Promise((resolve) => {
    Clementine.countDocuments({
      S2a: age !== '0' ? age : { $ne: null },
      S6: ses !== '0' ? { $in: ses } : { $ne: null },
      S0d: city !== '0' ? city : { $ne: null },
      S1: gender !== '0' ? gender : { $ne: null },
      [question]: value,
    })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getResponseBei = function ({ age, ses, city, gender }) {
  return new Promise((resolve) => {
    Brandindex.aggregate([
      {
        $match: {
          S2a: age !== '0' ? age : { $ne: null },
          S6: ses !== '0' ? { $in: ses } : { $ne: null },
          S0d: city !== '0' ? city : { $ne: null },
          S1: gender !== '0' ? gender : { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            brand: '$brand',
            index: '$brandIndex',
          },
          bei: { $avg: '$bei' },
          future: { $avg: '$future' },
          current: { $avg: '$current' },
        },
      },
      {
        $sort: {
          '_id.index': 1,
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

global.getResponseNps = function ({ age, ses, city, gender, question, value }) {
  return new Promise((resolve) => {
    Clementine.aggregate([
      {
        $match: {
          S2a: age !== '0' ? age : { $ne: null },
          S6: ses !== '0' ? { $in: ses } : { $ne: null },
          S0d: city !== '0' ? city : { $ne: null },
          S1: gender !== '0' ? gender : { $ne: null },
          [question]: `${value}`,
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

global.getResponseOverall = function ({
  age,
  ses,
  city,
  gender,
  question,
  questionOverall,
}) {
  return new Promise((resolve) => {
    Clementine.aggregate([
      {
        $match: {
          S2a: age !== '0' ? age : { $ne: null },
          S6: ses !== '0' ? { $in: ses } : { $ne: null },
          S0d: city !== '0' ? city : { $ne: null },
          S1: gender !== '0' ? gender : { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            code: { $toInt: `$${question}` },
          },
          base: {$sum:1},
          y: { $avg: { $toInt: `$${questionOverall}` } },
        },
      },
      {
        $sort: {
          '_id.code': 1,
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
