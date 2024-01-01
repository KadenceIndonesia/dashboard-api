const Region = require('../models/region');
const Province = require('../models/province');
const Area = require('../models/area');
const City = require('../models/city');
const Sensus = require('../models/sensus');
const Directorate = require('../models/directorate');
const Panel = require('../models/panels');
const Division = require('../models/division');

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

global.getOneAdminstrationRegionByCode = function (pid, region) {
  return new Promise((resolve) => {
    Region.findOne({ idProject: pid, regionCode: region })
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

global.getAdminstrationArea = function (pid, region) {
  return new Promise((resolve) => {
    Area.aggregate([
      {
        $match: {
          idProject: pid,
          idRegion: region === 0 || !region ? { $ne: null } : region,
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

global.getAdminstrationAreaByName = function (pid, area) {
  return new Promise((resolve) => {
    Area.findOne({ idProject: pid, areaName: area })
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

global.getAdministrationSensusAll = function (pid) {
  return new Promise((resolve) => {
    Sensus.find({ idProject: pid })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.updateSensusProduct = function (filter, value) {
  return new Promise((resolve) => {
    Sensus.updateOne(filter, value)
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdministrationSensusLatLong = function (
  pid,
  region,
  province,
  product
) {
  return new Promise((resolve) => {
    Sensus.find({
      idProject: pid,
      kanwil: region === '0' || !region ? { $ne: null } : region,
      province: province === '0' || !province ? { $ne: null } : province,
      product:
        product === '0' || !product
          ? {
              $in: [
                'emas',
                'kendaraan',
                'elektronik',
                'cicilEmas',
                'tabunganEmas',
                'barangMewah',
              ],
            }
          : { $in: [product] },
    })
      .select({ _id: 1, lat: 2, long: 3 })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdministrationSensusById = function (pid, id) {
  return new Promise((resolve) => {
    Sensus.findOne({ idProject: pid, _id: id })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationDirectorateList = function (pid) {
  return new Promise((resolve) => {
    Directorate.find({ idProject: pid })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationDirectorate = function (pid, id) {
  return new Promise((resolve) => {
    Directorate.findOne({ idProject: pid, idDirectorate: id })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationPanelList = function (
  pid,
  directorate,
  division,
  panel
) {
  return new Promise((resolve) => {
    Panel.find({
      idProject: pid,
      idDirectorate:
        directorate === 0 || !directorate ? { $ne: null } : directorate,
      idDivision: division === 0 || !division ? { $ne: null } : division,
      idPanel: panel === 0 || !panel ? { $ne: null } : panel,
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

global.getAdminstrationPanelDetail = function (pid, id) {
  return new Promise((resolve) => {
    Panel.findOne({ idProject: pid, idPanel: id })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAdminstrationDivisionList = function (pid, directorate) {
  return new Promise((resolve) => {
    Division.find({
      idProject: pid,
      idDirectorate:
        directorate === 0 || !directorate ? { $ne: null } : directorate,
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

global.getAdminstrationDivisionDetail = function (pid, id) {
  return new Promise((resolve) => {
    Division.findOne({ idProject: pid, idDivision: id })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
