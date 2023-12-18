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

global.getDataList = function (
  pid,
  division,
  panel,
  region,
  search,
  page,
  perPage
) {
  return new Promise((resolve) => {
    Full2rawdata.find({
      idProject: pid,
      FUNGSI_LINI_BISNIS:
        division === 0 || !division ? { $ne: null } : { $in: division },
      PANEL: panel === 0 || !panel ? { $ne: null } : panel,
      REGION: region === 0 || !region ? { $ne: null } : region,
      ID_Responden:
        search === 0 || !search ? { $ne: null } : { $regex: `.*${search}.*` },
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

global.getDataListFull = function (pid, division, panel, region, search) {
  return new Promise((resolve) => {
    Full2rawdata.aggregate([
      {
        $match: {
          idProject: pid,
          FUNGSI_LINI_BISNIS:
            division === '0' || !division ? { $ne: null } : { $in: division },
          PANEL: panel === '0' || !panel ? { $ne: null } : panel,
          REGION: region === '0' || !region ? { $ne: null } : region,
          ID_Responden:
            search === '0' || !search
              ? { $ne: null }
              : { $regex: `.*${search}.*` },
        },
      },
      {
        $addFields: {
          idPanel: { $toInt: '$PANEL' },
        },
      },
      {
        $addFields: {
          idRegion: { $toInt: '$REGION' },
        },
      },
      {
        $lookup: {
          from: 'panels',
          localField: 'idPanel',
          foreignField: 'idPanel',
          as: 'dataPanel',
        },
      },
      {
        $addFields: {
          panelName: { $arrayElemAt: ['$dataPanel.panel', 0] },
        },
      },
      {
        $addFields: {
          idDirectorate: { $arrayElemAt: ['$dataPanel.idDirectorate', 0] },
        },
      },
      {
        $addFields: {
          idDivision: { $arrayElemAt: ['$dataPanel.idDivision', 0] },
        },
      },
      {
        $lookup: {
          from: 'directorates',
          localField: 'idDirectorate',
          foreignField: 'idDirectorate',
          as: 'dataDirectorate',
        },
      },
      {
        $lookup: {
          from: 'divisions',
          localField: 'idDivision',
          foreignField: 'idDivision',
          as: 'dataDivisions',
        },
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'idRegion',
          foreignField: 'idRegion',
          as: 'dataRegion',
          pipeline: [
            {
              $match: {
                idProject: pid,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          directorateName: {
            $arrayElemAt: ['$dataDirectorate.directorate', 0],
          },
        },
      },
      {
        $addFields: {
          divisionName: { $arrayElemAt: ['$dataDivisions.division', 0] },
        },
      },
      {
        $addFields: {
          regionName: { $arrayElemAt: ['$dataRegion.regionName', 0] },
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

global.getDataBySbjNum = function (pid, panel, sbjNum) {
  return new Promise((resolve) => {
    Full2rawdata.findOne({
      idProject: pid,
      SbjNum: sbjNum,
      PANEL: panel,
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

global.getDataSlice = function (pid, panel, SbjNum) {
  return new Promise((resolve) => {
    Slices.findOne({
      idProject: pid,
      idPanel: panel,
      SbjNum: SbjNum,
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

global.countDataList = function (pid, division, panel, region, search) {
  return new Promise((resolve) => {
    Full2rawdata.countDocuments({
      idProject: pid,
      FUNGSI_LINI_BISNIS:
        division === 0 || !division ? { $ne: null } : { $in: division },
      PANEL: panel === 0 || !panel ? { $ne: null } : panel,
      REGION: region === 0 || !region ? { $ne: null } : region,
      ID_Responden:
        search === '0' || !search ? { $ne: null } : { $regex: `.*${search}.*` },
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

global.updateRawdata = function (filter, value) {
  return new Promise((resolve) => {
    Full2rawdata.updateOne(filter, value)
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
global.updateSlice = function (filter, value) {
  return new Promise((resolve) => {
    Slices.updateOne(filter, value)
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

global.getEvidenceDetail = function (pid, id) {
  return new Promise((resolve) => {
    Evidence.findOne({
      idProject: pid,
      _id: id,
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
        $addFields: {
          idRegion: '$_id.idRegion',
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

global.groupingRegionByPanelIrisan = function (pid, panel, strPanel, region) {
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
        $addFields: {
          idRegion: '$_id.idRegion',
        },
      },
      {
        $lookup: {
          from: 'slices',
          localField: '_id.idRegion',
          foreignField: 'idRegion',
          pipeline: [
            {
              $match: {
                idPanel: { $in: panel },
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

global.averageCsiPanel = function (panel, region) {
  return new Promise((resolve) => {
    Full2rawdata.aggregate([
      {
        $match: {
          PANEL: `${panel}`,
          REGION: region === 0 || !region ? { $ne: null } : `${region}`,
        },
      },
      {
        $group: {
          _id: {
            idPanel: '$PANEL',
          },
          score: { $avg: '$csi' },
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

global.averageCsiPanelIrisan = function (panel, region) {
  return new Promise((resolve) => {
    Slices.aggregate([
      {
        $match: {
          idPanel: panel,
          idRegion: region === 0 || !region ? { $ne: null } : region,
        },
      },
      {
        $group: {
          _id: {
            idPanel: '$idPanel',
          },
          score: { $avg: '$csi' },
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

global.deleteRawdata = function () {
  return new Promise((resolve) => {
    Full2rawdata.deleteMany({
      PANEL: '8',
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

global.deleteSlices = function (pid, panel) {
  return new Promise((resolve) => {
    Slices.deleteMany({
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
