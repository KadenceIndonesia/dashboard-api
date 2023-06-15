const Target = require('../models/target');

global.targetAll = function () {
  return new Promise((resolve) => {
    Target.find({})
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.targetByWave = function (wave) {
  return new Promise((resolve) => {
    Target.find({ wave: wave })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.targetByWaveRegion = function (wave, region) {
  return new Promise((resolve) => {
    Target.find({ wave: wave, regionName: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.targetByRegion = function (region) {
  return new Promise((resolve) => {
    Target.find({ regionName: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.targetByWaveRegionProvince = function (wave, region, province) {
  return new Promise((resolve) => {
    Target.find({ wave: wave, regionName: region, provinceName: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
global.targetByWaveRegionCodeProvince = function (wave, region, province) {
  return new Promise((resolve) => {
    Target.find({ wave: wave, regionCode: region, provinceName: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.targetByProvince = function (province) {
  return new Promise((resolve) => {
    Target.find({ provinceName: province })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.targetByWaveRegionProvinceCity = function (wave, region, province, city) {
    return new Promise((resolve) => {
      Target.find({ wave: wave, regionName: region, provinceName: province, cityName: city })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  };

global.targetByCity = function (city) {
  return new Promise((resolve) => {
    Target.find({ cityName: city })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
