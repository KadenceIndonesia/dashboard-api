const Clementine = require('../models/clementine');

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
