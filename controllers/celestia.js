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

    var result;

    if (!region || region === 0) {
      //tidak ada spesifik region
      result = await countTargetPanel(pid, directorate, division, panel);
    } else {
      //ada region
      var _getRegionDetailByID = await getRegionDetailByID(pid, panel, region);
      result = [{ target: _getRegionDetailByID.target }];
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Target',
      data: result[0],
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

    var result = 0;
    var _getPanelList = await getPanelList(pid, directorate, division, panel);

    for (let i = 0; i < _getPanelList.length; i++) {
      var _countFullRawdataPanel = await countFullRawdataPanel(
        pid,
        _getPanelList[i].idPanel,
        region
      );
      result = result + _countFullRawdataPanel;
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
