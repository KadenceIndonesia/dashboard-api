const Vehicle = require('../models/vehicles');
global.vehicleList = function (pid, city, province, search, page, perPage) {
  return new Promise((resolve) => {
    Vehicle.find({
      idProject: pid,
      province: province === 0 || !province ? { $ne: null } : province,
      city: city === 0 || !city ? { $ne: null } : city,
      number:
        search === 0 || !search ? { $ne: null } : { $regex: `.*${search}.*` },
    })
      .limit(perPage ? perPage : 10)
      .skip(page * perPage)
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.vehicleListAll = function (pid, city, province, search) {
  return new Promise((resolve) => {
    Vehicle.count({
      idProject: pid,
      province: province === 0 || !province ? { $ne: null } : province,
      city: city === 0 || !city ? { $ne: null } : city,
      number:
        search === 0 || !search ? { $ne: null } : { $regex: `.*${search}.*` },
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

global.vehicleDetailByNumber = function (pid, number) {
  return new Promise((resolve) => {
    Vehicle.findOne({
      idProject: pid,
      number: number,
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
