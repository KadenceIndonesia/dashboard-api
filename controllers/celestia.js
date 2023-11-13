const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');

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
    var _groupingRegionByPanel;

    //cari panel berdasarkan directorate dan division
    if (!panel || panel === 0) {
      var _getPanelList = await getPanelList(pid, directorate, division, panel);
      var arrayPanel = _getPanelList.map((data) => data.idPanel);
      _groupingRegionByPanel = await groupingRegionByPanel(
        pid,
        arrayPanel,
        arrayPanel.map(String),
        region
      );
    } else {
      _groupingRegionByPanel = await groupingRegionByPanel(
        pid,
        [panel],
        [`${panel}`],
        region
      );
    }

    for (let i = 0; i < _groupingRegionByPanel.length; i++) {
      result.push({
        code: _groupingRegionByPanel[i]._id.idRegion,
        region: _groupingRegionByPanel[i]._id.regionName,
        target: _groupingRegionByPanel[i].target,
        total: _groupingRegionByPanel[i].total,
        percent: _groupingRegionByPanel[i].percent,
      });
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
