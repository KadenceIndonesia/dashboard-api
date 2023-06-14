const Helper = require('../models/helper');

global.helperAll = function () {
  return new Promise((resolve) => {
    Helper.find({})
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.helperByWave = function (wave) {
  return new Promise((resolve) => {
    Helper.find({ wave: wave })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.helperByWaveRegion = function (wave, region) {
  return new Promise((resolve) => {
    Helper.find({ wave: wave, regionName: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.helperByRegion = function (region) {
  return new Promise((resolve) => {
    Helper.find({ regionName: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.helperByWaveRegionProvince = function (wave, region, province) {
  return new Promise((resolve) => {
    Helper.find({ wave: wave, regionName: region, provinceName: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.helperByProvince = function (province) {
  return new Promise((resolve) => {
    Helper.find({ provinceName: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.helperByWaveRegionProvinceCity = function (wave, region, province, city) {
    return new Promise((resolve) => {
      Helper.find({ wave: wave, regionName: region, provinceName: province, cityName: city })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

global.helperByCity = function (city) {
  return new Promise((resolve) => {
    Helper.find({ cityName: city })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
