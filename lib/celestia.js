const Panel = require('../models/panels');
const Full2rawdata = require('../models/full2rawdatas');
const Region = require('../models/region');
const Evidence = require('../models/evidence');
const Panelslices = require('../models/panelslices');
const Slices = require('../models/slice');

global.countTargetPanel = function (pid, directorate, division, panel, type) {
  return new Promise((resolve) => {
    Panel.aggregate([
      {
        $match: {
          idProject: pid,
          idDirectorate:
            directorate === 0 || !directorate ? { $ne: null } : directorate,
          idDivision: division === 0 || !division ? { $ne: null } : division,
          idPanel: panel === 0 || !panel ? { $ne: null } : panel,
          type: type === 0 || !type ? { $ne: null } : type,
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
        resolve(result[0]);
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

global.getPanelSlicesList = function (pid, directorate, division, panel) {
  return new Promise((resolve) => {
    Panel.find({
      idProject: pid,
      idDirectorate:
        directorate === 0 || !directorate ? { $ne: null } : directorate,
      idDivision: division === 0 || !division ? { $ne: null } : division,
      idPanel: panel === 0 || !panel ? { $ne: null } : panel,
      type: 'Panel Irisan',
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

global.getDataPanelSlices = function (pid, panel) {
  return new Promise((resolve) => {
    Panelslices.aggregate([
      {
        $match: {
          idProject: pid,
          idPanel: panel,
        },
      },
      {
        $addFields: {
          count: 0,
        },
      },
      {
        $lookup: {
          from: 'slices',
          localField: 'code',
          foreignField: 'code',
          as: 'rawdatas',
          pipeline: [
            {
              $match: {
                idPanel: panel,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          total: {
            $size: '$rawdatas',
          },
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

global.getDataDetail = function (pid, id) {
  return new Promise((resolve) => {
    Full2rawdata.findOne({
      idProject: pid,
      SbjNum: id,
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
      .sort('idRegion')
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

global.getEvidenceByID = function (pid, id) {
  return new Promise((resolve) => {
    Evidence.find({
      idProject: pid,
      SbjNum: id,
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

global.groupingRegionByPanel = function (pid, panel, strPanel, region) {
  return new Promise((resolve) => {
    Region.aggregate([
      {
        $match: {
          idProject: pid,
          idPanel: {
            $in: panel,
          },
          idRegion: region === 0 || !region ? { $ne: null } : region,
        },
      },
      {
        $group: {
          _id: {
            idRegion: '$idRegion',
            regionName: '$regionName',
          },
          target: { $sum: '$target' },
        },
      },
      {
        $addFields: {
          '_id.idRegionString': { $toString: '$_id.idRegion' },
        },
      },
      {
        $lookup: {
          from: 'full2rawdatas',
          localField: '_id.idRegionString',
          foreignField: 'REGION',
          pipeline: [
            {
              $match: {
                PANEL: { $in: strPanel },
              },
            },
          ],
          as: 'rawdatas',
        },
      },
      {
        $addFields: {
          total: {
            $size: '$rawdatas',
          },
        },
      },
      {
        $addFields: {
          percent: {
            $cond: {
              if: { $gt: ['$target', 0] },
              then: {
                $multiply: [{ $divide: ['$total', '$target'] }, 100],
              },
              else: 0,
            },
          },
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
