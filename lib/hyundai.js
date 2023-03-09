const Region = require('../models/region');
const Area = require('../models/area');
const City = require('../models/city');
const Dealer = require('../models/dealer');

global.getRegionByPid = function (pid) {
  return new Promise((resolve) => {
    Region.find({ idProject: pid })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAreaByPid = function (pid, region) {
  return new Promise((resolve) => {
    if (region) {
      Area.find({ idProject: pid, idRegion: region })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      Area.find({ idProject: pid })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    }
  });
};

global.getCityByPid = function (pid, area) {
  return new Promise((resolve) => {
    if (area) {
      City.find({ idProject: pid, idArea: area })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      City.find({ idProject: pid })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    }
  });
};

global.getDealerByPid = function (pid, city) {
  return new Promise((resolve) => {
    if (city) {
      Dealer.find({ idProject: pid, idCity: city })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      Dealer.find({ idProject: pid })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    }
  });
};
