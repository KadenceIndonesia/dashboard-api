const Region = require('../models/region');
const Area = require('../models/area');
const City = require('../models/city');
const Dealer = require('../models/dealer');
const User = require('../models/user');
const Touchpointgroup = require('../models/touchpointgroup');
const Touchpointscore = require('../models/touchpointscore');

global.getUserById = function (id) {
  return new Promise((resolve) => {
    User.find({ _id: Object(id) })
      .exec()
      .then((result) => {
        resolve(result[0]);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getRegionByPid = function (pid, arrayRegion) {
  return new Promise((resolve) => {
    Region.find({ idProject: pid, idRegion: { $in: arrayRegion } })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAreaByPid = function (pid, region, arrayArea) {
  return new Promise((resolve) => {
    if (region) {
      Area.find({
        idProject: pid,
        idRegion: region,
        idArea: { $in: arrayArea },
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      Area.find({ idProject: pid, idArea: { $in: arrayArea } })
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

global.getCityByPid = function (pid, area, arrayCity) {
  return new Promise((resolve) => {
    if (area) {
      City.find({ idProject: pid, idArea: area, idCity: { $in: arrayCity } })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      City.find({ idProject: pid, idCity: { $in: arrayCity } })
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

global.getDealerByPid = function (pid, city, dealer) {
  return new Promise((resolve) => {
    Dealer.find({ idProject: pid, idDealer: { $in: dealer } })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getDealerByFilter = function (pid, region, area, city, dealer) {
  return new Promise((resolve) => {
    if (region > 0) {
      if (area > 0) {
        Dealer.find({
          idProject: pid,
          idDealer: { $in: dealer },
          idRegion: region,
          idArea: area,
        })
          .exec()
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            resolve(error);
          });
        if (city > 0) {
          Dealer.find({
            idProject: pid,
            idDealer: { $in: dealer },
            idRegion: region,
            idArea: area,
            idCity: city,
          })
            .exec()
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              resolve(error);
            });
        } else {
          Dealer.find({
            idProject: pid,
            idDealer: { $in: dealer },
            idRegion: region,
            idArea: area,
          })
            .exec()
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              resolve(error);
            });
        }
      } else {
        Dealer.find({
          idProject: pid,
          idDealer: { $in: dealer },
          idRegion: region,
        })
          .exec()
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            resolve(error);
          });
      }
    } else {
      Dealer.find({
        idProject: pid,
        idDealer: { $in: dealer },
      })
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

//special case karena area ga ada di stg

global.getAreaByCity = function (pid, idCity) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, idCity: idCity })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.groupingCityByDealer = function (pid, dealer) {
  return new Promise((resolve) => {
    Dealer.find({ idProject: pid, idDealer: { $in: dealer } })
      .exec()
      .then((result) => {
        var arrayCity = [];
        for (let i = 0; i < result.length; i++) {
          if (arrayCity.indexOf(result[i].idCity) === -1) {
            arrayCity.push(result[i].idCity);
          }
        }
        resolve(arrayCity);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.groupingAreaByCity = function (pid, city) {
  return new Promise((resolve) => {
    City.find({ idProject: pid, idCity: { $in: city } })
      .exec()
      .then((result) => {
        var arrayArea = [];
        for (let i = 0; i < result.length; i++) {
          if (arrayArea.indexOf(result[i].idArea) === -1) {
            arrayArea.push(result[i].idArea);
          }
        }
        resolve(arrayArea);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.groupingRegionByArea = function (pid, area) {
  return new Promise((resolve) => {
    Area.find({ idProject: pid, idArea: { $in: area } })
      .exec()
      .then((result) => {
        var arrayRegion = [];
        for (let i = 0; i < result.length; i++) {
          if (arrayRegion.indexOf(result[i].idRegion) === -1) {
            arrayRegion.push(result[i].idRegion);
          }
        }
        resolve(arrayRegion);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getParentTouchPoint = function (pid) {
  return new Promise((resolve) => {
    Touchpointgroup.find({ idProject: pid, isParent: true })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getTouchPointByParent = function (pid, group) {
  return new Promise((resolve) => {
    Touchpointgroup.find({ idProject: pid, group: group })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.scoreTouchPointByParent = function (pid, code, arrayDealer, quarter) {
  return new Promise((resolve) => {
    if (quarter > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idDealer: { $in: arrayDealer },
        quarter: quarter,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idDealer: { $in: arrayDealer },
      })
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

global.scoreTouchPointByParentDealer = function (pid, dealer, quarter) {
  return new Promise((resolve) => {
    if (quarter > 0) {
      Touchpointscore.find({
        idProject: pid,
        idDealer: dealer,
        quarter: quarter,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      Touchpointscore.find({
        idProject: pid,
        idDealer: dealer,
      })
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

global.scoreTouchPointByRegion = function (pid, code, region, quarter) {
  return new Promise((resolve) => {
    if (quarter > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idRegion: region,
        quarter: quarter,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idRegion: region,
      })
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

global.bubbleSort = function (a, par) {
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < a.length - 1; i++) {
      if (a[i][par] < a[i + 1][par]) {
        var temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
};
