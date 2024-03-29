const Region = require('../models/region');
const Company = require('../models/company');
const Area = require('../models/area');
const City = require('../models/city');
const Dealer = require('../models/dealer');
const User = require('../models/user');
const Touchpointgroup = require('../models/touchpointgroup');
const Touchpointscore = require('../models/touchpointscore');
const Task = require('../models/task');

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

global.getCompanyByPid = function (pid, arrayRegion) {
  return new Promise((resolve) => {
    Company.find({ idProject: pid, idCompany: { $in: arrayRegion } })
      .exec()
      .then((result) => {
        resolve(result);
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

global.getDealerByIdDealer = function (pid, dealer) {
  return new Promise((resolve) => {
    Dealer.find({ idProject: pid, idDealer: dealer })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getDealerByFilter = function (
  pid,
  company,
  region,
  area,
  city,
  dealer,
  arrdealer,
  type
) {
  return new Promise((resolve) => {
    // if (
    //   parseInt(region) > 0 ||
    //   parseInt(company) > 0 ||
    //   parseInt(area) > 0 ||
    //   parseInt(city) > 0 ||
    //   parseInt(dealer) > 0
    // ) {
    //   // region tidak kosong,
    //   if (parseInt(company) === 0) {
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) === 0 &&
    //       parseInt(city) === 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idRegion: region,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) > 0 &&
    //       parseInt(city) === 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idRegion: region,
    //         idArea: area,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) > 0 &&
    //       parseInt(city) > 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idRegion: region,
    //         idArea: area,
    //         idCity: city,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) > 0 &&
    //       parseInt(city) > 0 &&
    //       parseInt(dealer) > 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: dealer,
    //         idRegion: region,
    //         idArea: area,
    //         idCity: city,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //   } else {
    //     if (
    //       parseInt(region) === 0 &&
    //       parseInt(area) === 0 &&
    //       parseInt(city) === 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idCompany: company,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) === 0 &&
    //       parseInt(city) === 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idCompany: company,
    //         idRegion: region,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) > 0 &&
    //       parseInt(city) === 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idCompany: company,
    //         idRegion: region,
    //         idArea: area,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) > 0 &&
    //       parseInt(city) > 0 &&
    //       parseInt(dealer) === 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: { $in: arrdealer },
    //         idCompany: company,
    //         idRegion: region,
    //         idArea: area,
    //         idCity: city,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //     if (
    //       parseInt(region) > 0 &&
    //       parseInt(area) > 0 &&
    //       parseInt(city) > 0 &&
    //       parseInt(dealer) > 0
    //     ) {
    //       Dealer.find({
    //         idProject: pid,
    //         idDealer: dealer,
    //         idCompany: company,
    //         idRegion: region,
    //         idArea: area,
    //         idCity: city,
    //         type: { $in: type },
    //       })
    //         .exec()
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           resolve(error);
    //         });
    //     }
    //   }
    // } else {
    // semua kosong
    Dealer.find({
      idProject: pid,
      idRegion: region !== '0' ? parseInt(region) : { $ne: null },
      idArea: area !== '0' ? parseInt(area) : { $ne: null },
      idCity: city !== '0' ? parseInt(city) : { $ne: null },
      idCompany: company !== '0' ? parseInt(company) : { $ne: null },
      idDealer: dealer !== '0' ? parseInt(dealer) : { $in: arrdealer },
      type: { $in: type },
    })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
    // }
  });
};

//special case karena area ga ada di stg

global.groupingCompanyByDealer = function (pid, dealer, company) {
  return new Promise((resolve) => {
    var query = '';
    if (company) {
      query = { idProject: pid, idDealer: { $in: dealer }, idCompany: company };
    } else {
      query = { idProject: pid, idDealer: { $in: dealer } };
    }
    Dealer.find(query)
      .exec()
      .then((result) => {
        var arrayCompany = [];
        for (let i = 0; i < result.length; i++) {
          if (arrayCompany.indexOf(result[i].idCompany) === -1) {
            arrayCompany.push(result[i].idCompany);
          }
        }
        resolve(arrayCompany);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

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

global.groupingCityByDealer = function (pid, dealer, region) {
  return new Promise((resolve) => {
    var query = '';
    if (region) {
      query = { idProject: pid, idDealer: { $in: dealer }, idRegion: region };
    } else {
      query = { idProject: pid, idDealer: { $in: dealer } };
    }
    Dealer.find(query)
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
    var query = { idProject: pid, idCity: { $in: city } };
    City.find(query)
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

global.getAllTouchPoint = function (pid) {
  return new Promise((resolve) => {
    Touchpointgroup.find({ idProject: pid })
      .exec()
      .then((result) => {
        resolve(result);
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

global.getParentTouchPointWithScore = function (pid) {
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

global.scoreTouchPointByParent = function (
  pid,
  code,
  arrayDealer,
  quarter,
  brand
) {
  return new Promise((resolve) => {
    if (parseInt(quarter) > 0 && parseInt(brand) === 0) {
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
    } else if (parseInt(quarter) === 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idDealer: { $in: arrayDealer },
        brand: brand,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else if (parseInt(quarter) > 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idDealer: { $in: arrayDealer },
        brand: brand,
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

global.scoreTouchPointByParentAllWave = function (
  pid,
  code,
  arrDealer,
  quarter,
  brand
) {
  return new Promise((resolve) => {
    Touchpointscore.aggregate([
      {
        $match: {
          idProject: pid,
          idDealer: { $in: arrDealer },
          code: { $in: code },
          quarter: quarter,
        },
      },
      {
        $group: {
          _id: {
            category: '$code',
            group: '$group',
            quarter: '$quarter',
          },
          // score: { $avg: { $toDouble: '$score' } },
          score: {
            $avg: {
              $cond: [
                {
                  $and: [{ $ne: ['$score', null] }, { $ne: ['$score', -1] }],
                },
                '$score',
                '$$REMOVE',
              ],
            },
          },
        },
      },
      {
        $sort: {
          '_id.group': 1,
        },
      },
      // {
      //   $group: {
      //     _id: {
      //       quarter: '$_id.quarter',
      //     },
      //     categories: {
      //       $push: '$_id.category',
      //     },
      //     data: {
      //       $push: '$score',
      //     },
      //   },
      // },
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

global.scoreTouchPointByParentDealer = function (pid, dealer, quarter, brand) {
  return new Promise((resolve) => {
    if (parseInt(quarter) > 0 && parseInt(brand) === 0) {
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
    } else if (parseInt(quarter) === 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        idDealer: dealer,
        brand: brand,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else if (parseInt(quarter) > 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        idDealer: dealer,
        quarter: quarter,
        brand: brand,
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
        quarter: quarter,
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

// global.scoreTouchPointByParentDealerTrended = function (
//   pid,
//   code,
//   dealer,
//   quarter
// ) {
//   return new Promise((resolve) => {
//     Touchpointscore.aggregate([
//       {
//         $match: {
//           idProject: pid,
//           code: code,
//           idDealer: dealer,
//         },
//       },
//       {
//         $sort: {
//           quarter: 1,
//         },
//       },
//     ])
//       .exec()
//       .then((result) => {
//         resolve(result);
//       })
//       .catch((error) => {
//         resolve(error);
//       });
//   });
// };

global.scoreTouchPointByParentDealerTrended = function (pid, code, dealer) {
  return new Promise((resolve) => {
    Touchpointscore.aggregate([
      {
        $match: {
          idProject: pid,
          code: { $in: code },
          idDealer: dealer,
        },
      },
      {
        $sort: {
          group: 1,
          quarter: 1,
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

global.scoreTouchPointByParentDealerCodeParent = function (
  pid,
  dealer,
  quarter,
  code
) {
  return new Promise((resolve) => {
    Touchpointscore.findOne({
      idProject: pid,
      idDealer: dealer,
      quarter: quarter !== '0' ? quarter : { $ne: null },
      code: code,
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

global.scoreTouchPointByRegion = function (pid, code, region, quarter, brand) {
  return new Promise((resolve) => {
    if (parseInt(quarter) > 0 && parseInt(brand) === 0) {
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
    } else if (parseInt(quarter) === 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idRegion: region,
        brand: brand,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else if (parseInt(quarter) > 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idRegion: region,
        brand: brand,
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

global.scoreTouchPointByRegionAllWave = function (
  pid,
  code,
  region,
  quarter,
  brand
) {
  return new Promise((resolve) => {
    Touchpointscore.aggregate([
      {
        $match: {
          idProject: pid,
          code: code,
          idRegion: region === 0 || !region ? { $ne: null } : { $in: region },
          quarter: quarter,
          brand: brand === 0 || !brand ? { $ne: null } : brand,
        },
      },
      {
        $group: {
          _id: {
            idRegion: '$idRegion',
          },
          score: { $avg: { $toDouble: '$score' } },
        },
      },
      {
        $sort: {
          '_id.idRegion': 1,
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

global.scoreTouchPointByDelaer = function (pid, code, dealer, quarter, brand) {
  return new Promise((resolve) => {
    if (parseInt(quarter) > 0 && parseInt(brand) === 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
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
    } else if (parseInt(quarter) === 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idDealer: dealer,
        brand: brand,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          resolve(error);
        });
    } else if (parseInt(quarter) > 0 && parseInt(brand) > 0) {
      Touchpointscore.find({
        idProject: pid,
        code: code,
        idDealer: dealer,
        brand: brand,
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

global.scoreTouchPointByDelaerAllWave = function (
  pid,
  code,
  dealer,
  quarter,
  brand
) {
  return new Promise((resolve) => {
    Touchpointscore.aggregate([
      {
        $match: {
          idProject: pid,
          code: code,
          idDealer: dealer === 0 || !dealer ? { $ne: null } : { $in: dealer },
          quarter: quarter,
          brand: brand === 0 || !brand ? { $ne: null } : brand,
        },
      },
      {
        $group: {
          _id: {
            idDealer: '$idDealer',
            quarter: '$quarter',
          },
          score: { $avg: { $toDouble: '$score' } },
        },
      },
      {
        $sort: {
          '_id.idDealer': 1,
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
    // if (parseInt(quarter) > 0 && parseInt(brand) === 0) {
    //   Touchpointscore.find({
    //     idProject: pid,
    //     code: code,
    //     idDealer: dealer,
    //     quarter: quarter,
    //   })
    //     .exec()
    //     .then((result) => {
    //       resolve(result);
    //     })
    //     .catch((error) => {
    //       resolve(error);
    //     });
    // } else if (parseInt(quarter) === 0 && parseInt(brand) > 0) {
    //   Touchpointscore.find({
    //     idProject: pid,
    //     code: code,
    //     idDealer: dealer,
    //     brand: brand,
    //   })
    //     .exec()
    //     .then((result) => {
    //       resolve(result);
    //     })
    //     .catch((error) => {
    //       resolve(error);
    //     });
    // } else if (parseInt(quarter) > 0 && parseInt(brand) > 0) {
    //   Touchpointscore.find({
    //     idProject: pid,
    //     code: code,
    //     idDealer: dealer,
    //     brand: brand,
    //     quarter: quarter,
    //   })
    //     .exec()
    //     .then((result) => {
    //       resolve(result);
    //     })
    //     .catch((error) => {
    //       resolve(error);
    //     });
    // } else {
    //   Touchpointscore.find({
    //     idProject: pid,
    //     code: code,
    //     idDealer: dealer,
    //   })
    //     .exec()
    //     .then((result) => {
    //       resolve(result);
    //     })
    //     .catch((error) => {
    //       resolve(error);
    //     });
    // }
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

global.bubbleSortAsc = function (a, par) {
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < a.length - 1; i++) {
      if (a[i][par] > a[i + 1][par]) {
        var temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
};

global.scoreTouchPointByDealer = function (pid, dealer, quarter) {
  return new Promise((resolve) => {
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
  });
};

global.scoreTouchPointParentByDealer = function (pid, dealer) {
  return new Promise((resolve) => {
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
  });
};

global.scoreTouchPointParentDealerByCode = function (
  pid,
  dealer,
  code,
  quarter
) {
  return new Promise((resolve) => {
    Touchpointscore.findOne({
      idProject: pid,
      idDealer: dealer,
      code: code,
      quarter: quarter,
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

// global.scoreTouchPointParentDealerByCode = function (pid, dealer, code, quarter) {
//   return new Promise((resolve) => {
//     Touchpointscore.find({
//       idProject: pid,
//       idDealer: dealer,
//       code: { $in: code },
//       quarter: quarter
//     })
//       .exec()
//       .then((result) => {
//         resolve(result);
//       })
//       .catch((error) => {
//         resolve(error);
//       });
//   });
// };

global.getTouchPointByGroup = function (pid, group) {
  return new Promise((resolve) => {
    Touchpointgroup.find({
      idProject: pid,
      group: group,
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

global.getTaskByIdDealerQuarter = function (pid, idDealer, quarter) {
  return new Promise((resolve) => {
    Task.findOne({
      idProject: pid,
      idDealer: idDealer,
      quarter: quarter,
    })
      .exec()
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          resolve({
            key: '-',
          });
        }
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getTouchPointScoreDetail = function (
  pid,
  idDealer,
  quarter,
  group,
  code
) {
  return new Promise((resolve) => {
    Touchpointscore.find({
      idProject: pid,
      idDealer: idDealer,
      quarter: quarter,
      code: code,
      group: group,
    })
      .exec()
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          resolve({
            key: '-',
          });
        }
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
