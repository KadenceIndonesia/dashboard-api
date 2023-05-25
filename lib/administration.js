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

global.getAdminstrationProvinceByRegion = function (pid, region) {
  return new Promise((resolve) => {
    Province.find({ idProject: pid, regionName: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationProvinceById = function (pid, province) {
  return new Promise((resolve) => {
    Province.find({ idProject: pid, provinceName: province })
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

global.getAdminstrationCityByName = function (pid, city) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, cityName: city })
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
    City.find({ idProject: pid, areaName: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationCityByArrayProvince = function (pid, province) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, areaName: { $in: province } })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
