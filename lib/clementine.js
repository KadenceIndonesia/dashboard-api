const Clementine = require('../models/clementine');
const Brandindex = require('../models/brandindex');

global.getResponse = function ({ age, ses, city, gender, question }) {
  return new Promise((resolve) => {
    Clementine.aggregate([
      {
        $match: {
          S2a: age !== '0' ? age : { $ne: null },
          S6: ses !== '0' ? ses : { $ne: null },
          S0d: city !== '0' ? city : { $ne: null },
          S1: gender !== '0' ? gender : { $ne: null },
        },
      },
      {
        $group: {
          _id: `$${question}`,
          y: { $sum: 1 },
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
      S6: ses !== '0' ? ses : { $ne: null },
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
          S6: ses !== '0' ? ses : { $ne: null },
          S0d: city !== '0' ? city : { $ne: null },
          S1: gender !== '0' ? gender : { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            brand: '$brand',
          },
          bei: { $avg: '$bei' },
          future: { $avg: '$future' },
          current: { $avg: '$current' },
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
