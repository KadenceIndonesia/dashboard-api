const Panel = require('../models/panels');
const Full2rawdata = require('../models/full2rawdatas');
const Region = require('../models/region');

global.countTargetPanel = function (pid, directorate, division, panel) {
  return new Promise((resolve) => {
    Panel.aggregate([
      {
        $match: {
          idProject: pid,
          idDirectorate:
            directorate === 0 || !directorate ? { $ne: null } : directorate,
          idDivision: division === 0 || !division ? { $ne: null } : division,
          idPanel: panel === 0 || !panel ? { $ne: null } : panel,
        },
      },
      {
        $group: {
          _id: null,
          target: { $sum: '$target' },
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

global.getPanelList = function (pid, directorate, division, panel) {
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

global.countFullRawdataPanel = function (pid, panel, region) {
  return new Promise((resolve) => {
    Full2rawdata.countDocuments({
      idProject: pid,
      PANEL: panel === 0 || !panel ? { $ne: null } : panel,
      REGION: region === 0 || !region ? { $ne: null } : region,
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

global.getDataList = function (pid, division, panel, region, page, perPage) {
  return new Promise((resolve) => {
    Full2rawdata.find({
      idProject: pid,
      FUNGSI_LINI_BISNIS:
        division === 0 || !division ? { $ne: null } : { $in: division },
      PANEL: panel === 0 || !panel ? { $ne: null } : panel,
      REGION: region === 0 || !region ? { $ne: null } : region,
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

global.countDataList = function (pid, division, panel, region) {
  return new Promise((resolve) => {
    Full2rawdata.countDocuments({
      idProject: pid,
      FUNGSI_LINI_BISNIS:
        division === 0 || !division ? { $ne: null } : { $in: division },
      PANEL: panel === 0 || !panel ? { $ne: null } : panel,
      REGION: region === 0 || !region ? { $ne: null } : region,
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

//administration
global.getRegionByPanel = function (pid, panel) {
  return new Promise((resolve) => {
    Region.find({
      idProject: pid,
      idPanel: panel,
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

global.getRegionDetailByID = function (pid, panel, region) {
  return new Promise((resolve) => {
    Region.findOne({
      idProject: pid,
      idRegion: region,
      idPanel: panel,
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

global.getRegionDetailByCode = function (pid, panel, region) {
  return new Promise((resolve) => {
    Region.findOne({
      idProject: pid,
      regionCode: region,
      idPanel: panel,
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
