const Rawdata = require('../models/rawdata');
const Station = require('../models/station');
const Fullrawdata = require('../models/fullrawdata');
const moment = require('moment');

global.countVisitRegion = function (pid, region, wave) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      region: region,
      wave: wave !== '0' ? wave : { $ne: null },
      question: 'S0',
      answer: '1',
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

global.countVisitRegion2 = function (pid, region, wave) {
  return new Promise((resolve) => {
    Rawdata.aggregate([
      {
        $match: {
          idProject: pid,
          question: 'S0',
          answer: '1',
          wave: wave !== '0' ? wave : { $ne: null },
          region: region !== '0' ? region : { $ne: null },
        },
      },
      {
        $group: { _id: '$region', count: { $sum: 1 } },
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

global.countVisitProvince = function (pid, province, wave) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      province: province,
      question: 'S0',
      answer: '1',
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

global.countAchievementTotal = function (pid, wave, region, province, city) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      region: region,
      wave: wave !== '0' ? wave : { $ne: null },
      region: region !== '0' ? region : { $ne: null },
      province: province !== '0' ? province : { $ne: null },
      city: city !== '0' ? city : { $ne: null },
      question: 'S0',
      answer: '1',
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

global.countAchievementTotalDate = function (
  pid,
  date,
  wave,
  region,
  province,
  city
) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      createDate: new Date(date),
      question: 'S0',
      answer: '1',
      wave: wave !== '0' ? wave : { $ne: null },
      region: region !== '0' ? region : { $ne: null },
      province: province !== '0' ? province : { $ne: null },
      city: city !== '0' ? city : { $ne: null },
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

global.countAchievementStatusPangkalan = function (
  pid,
  answer,
  wave,
  region,
  province,
  city
) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      question: 'P0',
      answer: answer,
      wave: wave !== '0' ? wave : { $ne: null },
      region: region !== '0' ? region : { $ne: null },
      province: province !== '0' ? province : { $ne: null },
      city: city !== '0' ? city : { $ne: null },
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

global.countByQuestionAndAnswer = function (
  pid,
  question,
  answer,
  wave,
  region,
  province,
  city
) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      question: question,
      answer: answer,
      wave: wave !== '0' ? wave : { $ne: null },
      region: region !== '0' ? region : { $ne: null },
      province: province !== '0' ? province : { $ne: null },
      city: city !== '0' ? city : { $ne: null },
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

global.countByAnswerOperationsIn = function (
  pid,
  question,
  arrAns,
  wave,
  region,
  province,
  city
) {
  return new Promise((resolve) => {
    Rawdata.countDocuments({
      idProject: pid,
      question: question,
      answer: { $in: arrAns },
      wave: wave !== '0' ? wave : { $ne: null },
      region: region !== '0' ? region : { $ne: null },
      province: province !== '0' ? province : { $ne: null },
      city: city !== '0' ? city : { $ne: null },
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

global.getGroupCity = function (pid, wave, region, province, city) {
  return new Promise((resolve) => {
    Rawdata.aggregate([
      {
        $match: { idProject: pid, question: 'A31', answer: '1' },
      },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
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

global.getListPangkalan = function (
  pid,
  wave,
  region,
  province,
  city,
  page,
  perPage
) {
  return new Promise((resolve) => {
    Fullrawdata.find({
      idProject: pid,
      WAVE: wave !== '0' ? wave : { $ne: null },
      A1: region !== '0' ? region : { $ne: null },
      A2: province !== '0' ? province : { $ne: null },
      A3: city !== '0' ? city : { $ne: null },
    })
      .limit(perPage ? perPage : 20)
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

global.countPangkalanList = function (pid, wave, region, province, city) {
  return new Promise((resolve) => {
    Fullrawdata.countDocuments({
      idProject: pid,
      WAVE: wave !== '0' ? wave : { $ne: null },
      A1: region !== '0' ? region : { $ne: null },
      A2: province !== '0' ? province : { $ne: null },
      A3: city !== '0' ? city : { $ne: null },
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

global.getStationDetail = function (key) {
  return new Promise((resolve) => {
    Station.findOne({
      key: key,
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
