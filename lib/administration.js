const Province = require('../models/province');
const City = require('../models/city');

global.getAdminstrationProvince = function (pid) {
  return new Promise((resolve) => {
    Province.find({ idProject: pid })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationCityAll = function (pid) {
  return new Promise((resolve) => {
    City.find({ idProject: pid })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationCityByProvince = function (pid, province) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, idArea: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
