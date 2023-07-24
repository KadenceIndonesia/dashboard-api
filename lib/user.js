const User = require('../models/user');

global.getUserEmail = function (email) {
  return new Promise((resolve) => {
    User.findOne({ email: email })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
