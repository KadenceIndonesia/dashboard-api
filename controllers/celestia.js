const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');
const mongoose = require('mongoose');
const Full2rawdata = require('../models/full2rawdatas');
const Evidence = require('../models/evidence');

require('../lib/index');
require('../lib/administration');
require('../lib/celestia');

//administrations

exports.getAdministrationRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    // const directorate = parseInt(req.query.directorate);
    const panel = req.query.panel ? parseInt(req.query.panel) : 0;

    var result = await getRegionByPanel(pid, panel);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Target',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAdministrationRegionDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    // const directorate = parseInt(req.query.directorate);
    const panel = req.params.panel ? parseInt(req.params.panel) : 0;
    const region = parseInt(req.params.region);

    var result = await getRegionDetailByID(pid, panel, region);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Target',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTargetTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const division = parseInt(req.query.division);
    const panel = parseInt(req.query.panel);
    const region = parseInt(req.query.region);

    var result = {
      panelUtama: 0,
      panelIrisan: 0,
    };

    if (!region || region === 0) {
      //tidak ada spesifik region
      var panelUtama = await countTargetPanel(
        pid,
        directorate,
        division,
        panel,
        'Panel Utama'
      );

      var panelIrisan = await countTargetPanel(
        pid,
        directorate,
        division,
        panel,
        'Panel Irisan'
      );
      result.panelUtama = panelUtama ? panelUtama.target : 0;
      result.panelIrisan = panelIrisan ? panelIrisan.target : 0;
    } else {
      //ada region
      var _getRegionDetailByID = await getRegionDetailByID(pid, panel, region);
      result.panelUtama = _getRegionDetailByID.target;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Target',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementPanel = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const division = parseInt(req.query.division);
    const panel = parseInt(req.query.panel);
    const region = parseInt(req.query.region);

    var result = [];
    if (region) {
      var _getRegionDetailByID = await getRegionDetailByID(pid, panel, region);
    }
    var _getPanelList = await getPanelList(pid, directorate, division, panel);
    for (let i = 0; i < _getPanelList.length; i++) {
      var _averageCsiPanel = await averageCsiPanel(_getPanelList[i].idPanel);
      result.push({
        id: _getPanelList[i].idPanel,
        panel: _getPanelList[i].panel,
        target:
          !region || region === 0
            ? _getPanelList[i].target
            : _getRegionDetailByID.target,
        total: 0,
        percent: 0,
        type: _getPanelList[i].type,
        csi:
          _getPanelList[i].type === 'Panel Utama'
            ? _averageCsiPanel[0].score
            : '-',
      });
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].type === 'Panel Utama') {
        var _countFullRawdataPanel = await countFullRawdataPanel(
          pid,
          result[i].id,
          region
        );
        result[i].total = _countFullRawdataPanel;
        result[i].percent = countPercent(
          _countFullRawdataPanel,
          result[i].target
        );
      } else {
        var _getDataPanelSlices = await getDataPanelSlices(pid, result[i].id);
        var totalSlices = 0;
        _getDataPanelSlices.map(
          (data) => (totalSlices = totalSlices + data.total)
        );
        result[i].total = totalSlices;
        result[i].percent = countPercent(totalSlices, result[i].target);
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement panel',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementPanelSlices = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const division = parseInt(req.query.division);
    const panel = parseInt(req.query.panel);
    const region = parseInt(req.query.region);

    var result = [];
    if (region) {
      var _getRegionDetailByID = await getRegionDetailByID(pid, panel, region);
    }
    var _getPanelSlicesList = await getPanelSlicesList(
      pid,
      directorate,
      division
    );

    for (let i = 0; i < _getPanelSlicesList.length; i++) {
      var _getDataPanelSlices = await getDataPanelSlices(
        pid,
        _getPanelSlicesList[i].idPanel
      );
      var totalSlices = 0;
      _getDataPanelSlices.map(
        (data) => (totalSlices = totalSlices + data.total)
      );
      result.push({
        id: _getPanelSlicesList[i].idPanel,
        panel: _getPanelSlicesList[i].panel,
        target:
          !region || region === 0
            ? _getPanelSlicesList[i].target
            : _getRegionDetailByID.target,
        total: totalSlices,
        percent: countPercent(
          totalSlices,
          !region || region === 0
            ? _getPanelSlicesList[i].target
            : _getRegionDetailByID.target
        ),
        type: _getPanelSlicesList[i].type,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement panel',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementPanelTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const division = parseInt(req.query.division);
    const panel = parseInt(req.query.panel);
    const region = parseInt(req.query.region);

    var result = {
      panelUtama: 0,
      panelIrisan: 0,
    };

    var _getPanelList = await getPanelList(pid, directorate, division, panel);
    for (let i = 0; i < _getPanelList.length; i++) {
      if (_getPanelList[i].type === 'Panel Utama') {
        var _countFullRawdataPanel = await countFullRawdataPanel(
          pid,
          _getPanelList[i].idPanel,
          region
        );
        result.panelUtama = result.panelUtama + _countFullRawdataPanel;
      } else {
        var _getDataPanelSlices = await getDataPanelSlices(
          pid,
          _getPanelList[i].idPanel
        );
        var totalSlices = 0;
        _getDataPanelSlices.map(
          (data) => (totalSlices = totalSlices + data.total)
        );
        result.panelIrisan = result.panelIrisan + totalSlices;
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement panel',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const division = parseInt(req.query.division);
    const panel = parseInt(req.query.panel);
    const region = parseInt(req.query.region);

    var result = [];
    var _groupingRegionByPanel = [];
    var _groupingRegionByPanelIrisan = [];

    var arrayPanelUtama = [];
    var arrayPanelIrisan = [];

    var _getPanelList = await getPanelList(pid, directorate, division, panel);
    for (let i = 0; i < _getPanelList.length; i++) {
      if (_getPanelList[i].type === 'Panel Utama') {
        arrayPanelUtama.push(_getPanelList[i].idPanel);
      } else {
        arrayPanelIrisan.push(_getPanelList[i].idPanel);
      }
    }

    //cari panel berdasarkan directorate dan division

    // _groupingRegionByPanel = await groupingRegionByPanel(
    //   pid,
    //   arrayPanelUtama,
    //   arrayPanelUtama.map(String),
    //   region
    // );
    // _groupingRegionByPanelIrisan = await groupingRegionByPanelIrisan(
    //   pid,
    //   arrayPanelIrisan,
    //   arrayPanelIrisan.map(String),
    //   region
    // );

    if (!panel || panel === 0) {
      _groupingRegionByPanel = await groupingRegionByPanel(
        pid,
        arrayPanelUtama,
        arrayPanelUtama.map(String),
        region
      );
      _groupingRegionByPanelIrisan = await groupingRegionByPanelIrisan(
        pid,
        arrayPanelIrisan,
        arrayPanelIrisan.map(String),
        region
      );
    } else {
      _groupingRegionByPanel = await groupingRegionByPanel(
        pid,
        arrayPanelUtama,
        arrayPanelUtama.map(String),
        region
      );
      _groupingRegionByPanelIrisan = await groupingRegionByPanelIrisan(
        pid,
        arrayPanelIrisan,
        arrayPanelIrisan.map(String),
        region
      );
    }

    if (_groupingRegionByPanel.length > 0) {
      for (let i = 0; i < _groupingRegionByPanel.length; i++) {
        var _findObj = await findObj(
          _groupingRegionByPanelIrisan,
          'idRegion',
          _groupingRegionByPanel[i].idRegion
        );
        var totalTarget =
          _findObj !== -1
            ? _groupingRegionByPanel[i].target +
              _groupingRegionByPanelIrisan[_findObj].target
            : _groupingRegionByPanel[i].target;

        var totalAcv =
          _findObj !== -1
            ? _groupingRegionByPanel[i].total +
              _groupingRegionByPanelIrisan[_findObj].total
            : _groupingRegionByPanel[i].total;

        result.push({
          code: _groupingRegionByPanel[i]._id.idRegion,
          region: _groupingRegionByPanel[i]._id.regionName,
          target: totalTarget,
          total: totalAcv,
          percent: countPercent(totalAcv, totalTarget),
        });
      }
    } else {
      for (let i = 0; i < _groupingRegionByPanelIrisan.length; i++) {
        var _findObj = await findObj(
          _groupingRegionByPanel,
          'idRegion',
          _groupingRegionByPanelIrisan[i].idRegion
        );
        var totalTarget =
          _findObj !== -1
            ? _groupingRegionByPanelIrisan[i].target +
              _groupingRegionByPanel[_findObj].target
            : _groupingRegionByPanelIrisan[i].target;

        var totalAcv =
          _findObj !== -1
            ? _groupingRegionByPanelIrisan[i].total +
              _groupingRegionByPanel[_findObj].total
            : _groupingRegionByPanelIrisan[i].total;

        result.push({
          code: _groupingRegionByPanelIrisan[i]._id.idRegion,
          region: _groupingRegionByPanelIrisan[i]._id.regionName,
          target: totalTarget,
          total: totalAcv,
          percent: countPercent(totalAcv, totalTarget),
        });
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement region',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getRawdataList = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const division = req.query.division;
    const panel = parseInt(req.query.panel);
    const region = parseInt(req.query.region);
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);

    var _getAdminstrationDivisionList = await getAdminstrationDivisionList(
      pid,
      directorate
    );

    var _division = 0;

    if (directorate && (!division || division === '0')) {
      _division = _getAdminstrationDivisionList.map((data) =>
        String(data.idDivision)
      );
    } else if (directorate && division) {
      _division = [division];
    }

    var result = [];
    var _getDataList = await getDataList(
      pid,
      _division,
      panel,
      region,
      page,
      perPage
    );
    var totalData = await countDataList(pid, _division, panel, region);

    for (let i = 0; i < _getDataList.length; i++) {
      var detailPanel = await getAdminstrationPanelDetail(
        pid,
        parseInt(_getDataList[i]['PANEL'])
      );
      var detailDirectorate = await getAdminstrationDirectorate(
        pid,
        detailPanel.idDirectorate
      );
      var detailDivision = await getAdminstrationDivisionDetail(
        pid,
        detailPanel.idDivision
      );
      var detailRegion = await getRegionDetailByCode(
        pid,
        _getDataList[i]['PANEL'],
        _getDataList[i]['REGION']
      );
      result.push({
        sbjNum: _getDataList[i].SbjNum,
        id: _getDataList[i].ID_Responden,
        nama: _getDataList[i].Nama_Responden,
        directorate: detailDirectorate.directorate,
        division: detailDivision.division,
        panel: detailPanel.panel,
        region: detailRegion ? detailRegion.regionName : '-',
        phone: _getDataList[i].phone ? _getDataList[i].phone : '-',
        onlinePanel:
          _getDataList[i].onlinePanel === '1'
            ? 'Ya'
            : _getDataList[i].onlinePanel === '2'
            ? 'Tidak'
            : '-',
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get rawdata list',
      totalData: totalData,
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getRawdataDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = req.params.id;

    var result;

    var data = await getDataDetail(pid, id);

    var detailPanel = await getAdminstrationPanelDetail(
      pid,
      parseInt(data['PANEL'])
    );
    var detailDirectorate = await getAdminstrationDirectorate(
      pid,
      detailPanel.idDirectorate
    );
    var detailDivision = await getAdminstrationDivisionDetail(
      pid,
      detailPanel.idDivision
    );
    var detailRegion = await getRegionDetailByCode(
      pid,
      data['PANEL'],
      data['REGION']
    );

    result = {
      sbjNum: data.SbjNum,
      id: data.ID_Responden,
      nama: data.Nama_Responden,
      directorate: detailDirectorate.directorate,
      division: detailDivision.division,
      panel: detailPanel.panel,
      region: detailRegion ? detailRegion.regionName : '-',
    };

    res.status(200).json({
      statusCode: 200,
      message: 'Success get achievement panel',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEvidenceDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const id = parseInt(req.params.id);

    var result = await getEvidenceByID(pid, id);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Evidence Detail',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.postImportRawdata = async function (req, res) {
  try {
    const pid = req.params.pid;
    const panel = req.params.panel;
    var filename = req.files.file;
    var extension = path.extname(filename.name);
    var arrext = ['.xls', '.xlsx'];
    var checkextension = arrext.indexOf(extension);
    var newfilename = `${pid}_${moment().format(
      'YYYY_MM_DD_HH_mm_ss'
    )}${extension}`;
    var uploadPath = `${process.env.UPLOADPATH}public/fileUpload/${newfilename}`;
    var total = 0;

    filename.mv(uploadPath, async function (errupload) {
      if (errupload) {
        res.status(400).json({
          statusCode: 401,
          message: 'Error Uplaod',
        });
      } else {
        var data = await excelFilePath(uploadPath);
        for (let i = 0; i < data.length; i++) {
          var _getDataBySbjNum = await getDataBySbjNum(
            pid,
            String(panel),
            data[i].SbjNum
          );
          if (!_getDataBySbjNum) {
            const insertNewScore = new Full2rawdata({
              _id: new mongoose.Types.ObjectId(),
              idProject: pid,
              SbjNum: data[i].SbjNum,
              createDate: excelDatetoJS(data[i].Date),
              Duration: data[i].Duration,
              Upload: String(excelDatetoJS(data[i].Upload)),
              Complete: data[i].Complete,
              ID_Responden: data[i].ID_Responden,
              Nama_Responden: data[i].Nama_Responden,
              FUNGSI_LINI_BISNIS: `${data[i]['FUNGSI_LINI_BISNIS']}`,
              PANEL: panel,
              KOTA: data[i].KOTA,
              REGION: data[i].REGION,
              phone: data[i].Handphone,
              onlinePanel: data[i].onlinePanel,
              csi: data[i].csi,
            });
            insertNewScore
              .save()
              .then((result) => {
                total++;
              })
              .catch((err) => console.log(err));
          }
        }

        res.status(200).json({
          statusCode: 200,
          message: 'Success import rawdata',
          data: {
            total: total,
          },
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.postImportRawdataUpdate = async function (req, res) {
  try {
    const pid = req.params.pid;
    const panel = req.params.panel;
    var filename = req.files.file;
    var extension = path.extname(filename.name);
    var arrext = ['.xls', '.xlsx'];
    var checkextension = arrext.indexOf(extension);
    var newfilename = `${pid}_${moment().format(
      'YYYY_MM_DD_HH_mm_ss'
    )}${extension}`;
    var uploadPath = `${process.env.UPLOADPATH}public/fileUpload/${newfilename}`;
    var total = 0;

    filename.mv(uploadPath, async function (errupload) {
      if (errupload) {
        res.status(400).json({
          statusCode: 401,
          message: 'Error Uplaod',
        });
      } else {
        var data = await excelFilePath(uploadPath);
        for (let i = 0; i < data.length; i++) {
          var filter = {
            SbjNum: data[i].SbjNum,
          };
          var value = {
            createDate: excelDatetoJS(data[i].Date),
            Duration: data[i].Duration,
            Upload: String(excelDatetoJS(data[i].Upload)),
            Complete: data[i].Complete,
            ID_Responden: data[i].ID_Responden,
            Nama_Responden: data[i].Nama_Responden,
            FUNGSI_LINI_BISNIS: `${data[i]['FUNGSI_LINI_BISNIS']}`,
            PANEL: panel,
            KOTA: data[i].KOTA,
            REGION: data[i].REGION,
            phone: data[i].Handphone,
            onlinePanel: data[i].onlinePanel,
            csi: data[i].csi,
          };
          await updateRawdata(filter, value);
        }

        res.status(200).json({
          statusCode: 200,
          message: 'Success update rawdata',
          data: {
            total: total,
          },
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.postImportEvidence = async function (req, res) {
  try {
    const pid = req.params.pid;
    const panel = req.params.panel;
    var filename = req.files.file;
    var extension = path.extname(filename.name);
    var newfilename = `${pid}_${moment().format(
      'YYYY_MM_DD_HH_mm_ss'
    )}${extension}`;
    var uploadPath = `${process.env.UPLOADPATH}public/fileUpload/${newfilename}`;
    var total = 0;

    filename.mv(uploadPath, async function (errupload) {
      if (errupload) {
        res.status(400).json({
          statusCode: 401,
          message: 'Error Uplaod',
        });
      } else {
        var data = await excelFilePath(uploadPath);
        for (let i = 0; i < data.length; i++) {
          const insertNewScore = new Evidence({
            _id: new mongoose.Types.ObjectId(),
            SbjNum: data[i].SubjectID,
            idProject: pid,
            idPanel: panel,
            link: data[i].ImageURL,
          });
          insertNewScore
            .save()
            .then((result) => {
              total++;
            })
            .catch((err) => console.log(err));
        }

        res.status(200).json({
          statusCode: 200,
          message: 'Success import rawdata',
          data: {
            total: total,
          },
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
