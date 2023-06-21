const Region = require('../models/region');
const Province = require('../models/province');
const City = require('../models/city');

global.getAdminstrationRegion = function (pid) {
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

global.getAdminstrationRegionByName = function (pid, region) {
  return new Promise((resolve) => {
    Region.find({ idProject: pid, regionName: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationRegionByCode = function (pid, region) {
  return new Promise((resolve) => {
    Region.find({ idProject: pid, regionCode: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationRegionByCode = function (pid, region) {
  return new Promise((resolve) => {
    Region.find({ idProject: pid, regionCode: region })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationRegionByCodeWave = function (pid, region, wave) {
  return new Promise((resolve) => {
    Region.find({ idProject: pid, regionCode: region, wave: wave })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

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

global.getAdminstrationProvinceByArray = function (pid, province) {
  return new Promise((resolve) => {
    Province.find({ idProject: pid, idProvince: { $in: province } })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
global.getAdminstrationProvinceByRegionArrayProvince = function (
  pid,
  region,
  province
) {
  return new Promise((resolve) => {
    Province.find({
      idProject: pid,
      idProvince: { $in: province },
      regionName: region,
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

global.getAdminstrationCityWave = function (pid, wave) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, wave: wave })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationCityWaveProvince = function (pid, wave, province) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, wave: wave, areaName: province })
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

global.getAdminstrationCityByProvinceWave = function (pid, province, wave) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, areaName: province, wave: wave })
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
