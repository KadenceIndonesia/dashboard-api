const Project = require('../models/project');
const Attribute = require('../models/attributes');
const Report = require('../models/reports');
const Projects = require('../models/project');
const fs = require('fs');
const path = require('path');
const xslx = require('xlsx');
const attributes = require('../models/attributes');
const jwt = require('jsonwebtoken');
require('../lib/hyundai');

exports.getHyundaiRegion = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    const pid = req.params.pid;
    var _groupingCityByDealer = await groupingCityByDealer(pid, accessDealer);
    var _groupingAreaByCity = await groupingAreaByCity(
      pid,
      _groupingCityByDealer
    );
    var _groupingRegionByArea = await groupingRegionByArea(
      pid,
      _groupingAreaByCity
    );

    var _getRegionByPid = await getRegionByPid(pid, _groupingRegionByArea);
    var region = [];
    for (let i = 0; i < _getRegionByPid.length; i++) {
      region.push(_getRegionByPid[i]);
    }
    res.status(200).json(region);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiArea = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    const pid = req.params.pid;
    const region = req.query.region;
    var _groupingCityByDealer = await groupingCityByDealer(pid, accessDealer);
    var _groupingAreaByCity = await groupingAreaByCity(
      pid,
      _groupingCityByDealer
    );

    var _getAreaByPid = await getAreaByPid(pid, region, _groupingAreaByCity);
    var response = [];
    for (let i = 0; i < _getAreaByPid.length; i++) {
      response.push(_getAreaByPid[i]);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiCity = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    const pid = req.params.pid;
    const area = req.query.area;
    var _groupingCityByDealer = await groupingCityByDealer(pid, accessDealer);
    var _getCityByPid = await getCityByPid(pid, area, _groupingCityByDealer);
    var region = [];
    for (let i = 0; i < _getCityByPid.length; i++) {
      region.push(_getCityByPid[i]);
    }
    res.status(200).json(region);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiDealerTotal = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    const pid = req.params.pid;
    const city = req.query.city;
    var accessDealer = detailUser.access;
    var _getDealerByPid = await getDealerByPid(pid, city, accessDealer);
    var response = [];
    for (let i = 0; i < _getDealerByPid.length; i++) {
      res.status(200).json({
        statusCode: 200,
        message: 'Success get total achievement',
        total: _getDealerByPid.length,
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiDealer = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    const pid = req.params.pid;
    const city = req.query.city;
    var accessDealer = detailUser.access;
    var _getDealerByPid = await getDealerByPid(pid, city, accessDealer);
    var response = [];
    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push(_getDealerByPid[i]);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiDealerFilter = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;

    var accessDealer = detailUser.access;
    var _getDealerByPid = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      accessDealer
    );
    console.log(_getDealerByPid);
    var response = [];
    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push(_getDealerByPid[i]);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementTotal = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    const pid = req.params.pid;

    var data = await excelData(pid);
    var count = 0;
    for (let i = 0; i < data.length; i++) {
      if (accessDealer.indexOf(data[i].dealer) !== -1) {
        count++;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get total achievement',
      total: count,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementGroupByRegion = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    const pid = req.params.pid;
    var _groupingCityByDealer = await groupingCityByDealer(pid, accessDealer);
    var _groupingAreaByCity = await groupingAreaByCity(
      pid,
      _groupingCityByDealer
    );
    var _groupingRegionByArea = await groupingRegionByArea(
      pid,
      _groupingAreaByCity
    );

    var _getRegionByPid = await getRegionByPid(pid, _groupingRegionByArea);
    var response = [];
    // array region to response
    for (let i = 0; i < _getRegionByPid.length; i++) {
      response.push({
        id: _getRegionByPid[i].idRegion,
        label: _getRegionByPid[i].regionName,
        value: 0,
      });
    }

    var data = await excelData(pid);
    for (let i = 0; i < data.length; i++) {
      var _findObj = await findObj(response, 'id', data[i].region);
      response[_findObj].value = response[_findObj].value + 1;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get total achievement',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementGroupByArea = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    const pid = req.params.pid;
    const region = req.query.region;
    var _groupingCityByDealer = await groupingCityByDealer(pid, accessDealer);
    var _groupingAreaByCity = await groupingAreaByCity(
      pid,
      _groupingCityByDealer
    );

    var _getAreaByPid = await getAreaByPid(pid, region, _groupingAreaByCity);
    var response = [];
    // array region to response
    for (let i = 0; i < _getAreaByPid.length; i++) {
      response.push({
        id: _getAreaByPid[i].idRegion,
        label: _getAreaByPid[i].areaName,
        value: 0,
      });
    }

    var data = await excelData(pid);
    for (let i = 0; i < data.length; i++) {
      var areaByDealer = await getAreaByCity(pid, data[i]['S0']);
      var _findObj = await findObj(response, 'id', areaByDealer[0].idArea);
      if (_findObj !== -1) {
        response[_findObj].value = response[_findObj].value + 1;
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get total achievement',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementGroupByBrand = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var response = [];

    const pid = req.params.pid;
    var data = await excelData(pid);
    var kodeAttributeSTG =
      pid === 'IDE3358' ? 'Usership_Mobil' : 'USERSHIP_MOBIL';

    var attribute = await attributeByQidx(pid, kodeAttributeSTG);
    for (let i = 0; i < attribute.attribute.length; i++) {
      response.push({
        id: attribute.attribute[i].code,
        label: attribute.attribute[i].label,
        value: 0,
      });
    }
    for (let i = 0; i < data.length; i++) {
      var _findObj = await findObj(response, 'id', data[i][kodeAttributeSTG]);
      if (_findObj !== -1) {
        response[_findObj].value = response[_findObj].value + 1;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get total achievement',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementGroupBySkenario = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var response = [];

    const pid = req.params.pid;
    var data = await excelData(pid);
    var kodeAttributeSTG =
      pid === 'IDE3358' ? 'Jenis_Skenario' : 'JENIS_SCENARIO_SERVICE';
    var attribute = await attributeByQidx(pid, kodeAttributeSTG);
    for (let i = 0; i < attribute.attribute.length; i++) {
      response.push({
        id: attribute.attribute[i].code,
        label: attribute.attribute[i].label,
        value: 0,
      });
    }
    for (let i = 0; i < data.length; i++) {
      var _findObj = await findObj(response, 'id', data[i][kodeAttributeSTG]);
      if (_findObj !== -1) {
        response[_findObj].value = response[_findObj].value + 1;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get total achievement',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointGroupParent = async function (req, res) {
  try {
    const pid = req.params.pid;

    var response = await getParentTouchPoint(pid);
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointChildGroup = async function (req, res) {
  try {
    const pid = req.params.pid;
    const group = req.params.group;
    var response = await getTouchPointByParent(pid, group);
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint child',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreParent = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var response = [];
    var touchPointParent = await getParentTouchPoint(pid);

    for (let i = 0; i < touchPointParent.length; i++) {
      response.push({
        code: touchPointParent[i].code,
        label: touchPointParent[i].label,
        count: 0,
        value: 0,
      });
    }

    for (let i = 0; i < response.length; i++) {
      var _touchPointScore = await scoreTouchPointByParent(
        pid,
        response[i].code,
        arrDealer
      );
      var touchPointCount = 0;
      var touchPointLength = 0;
      for (let x = 0; x < _touchPointScore.length; x++) {
        if (_touchPointScore[x].score !== -1) {
          touchPointCount = touchPointCount + _touchPointScore[x].score;
          touchPointLength++;
        }
      }
      response[i].count = Math.round(
        touchPointCount / touchPointLength
      ).toFixed(2);
      response[i].value = Math.round(
        touchPointCount / touchPointLength
      ).toFixed(2);
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreQuarterTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var response = [
      {
        label: 'Q1',
        value: 0,
      },
      {
        label: 'Q2',
        value: 0,
      },
      {
        label: 'Q3',
        value: 0,
      },
      {
        label: 'Q4',
        value: 0,
      },
    ];
    var touchPointCount = 0;
    var _touchPointScore = await scoreTouchPointByParent(
      pid,
      'score',
      arrDealer
    );

    for (let x = 0; x < _touchPointScore.length; x++) {
      touchPointCount = touchPointCount + _touchPointScore[x].score;
    }
    response[0].value = touchPointCount / _touchPointScore.length;
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreRegionTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var _groupingCityByDealer = await groupingCityByDealer(pid, arrDealer);
    var _groupingAreaByCity = await groupingAreaByCity(
      pid,
      _groupingCityByDealer
    );
    var _groupingRegionByArea = await groupingRegionByArea(
      pid,
      _groupingAreaByCity
    );

    var _getRegionByPid = await getRegionByPid(pid, _groupingRegionByArea);
    var regionArr = [];
    for (let i = 0; i < _getRegionByPid.length; i++) {
      regionArr.push(_getRegionByPid[i]);
    }
    var response = [];
    for (let i = 0; i < regionArr.length; i++) {
      response.push({
        code: regionArr[i].idRegion,
        label: regionArr[i].regionName,
        value: 0,
      });
    }

    for (let i = 0; i < response.length; i++) {
      var _scoreTouchPointByRegion = await scoreTouchPointByRegion(
        pid,
        'score',
        response[i].code
      );
      var touchPointCount = 0;
      if (_scoreTouchPointByRegion.length > 0) {
        for (let x = 0; x < _scoreTouchPointByRegion.length; x++) {
          touchPointCount = touchPointCount + _scoreTouchPointByRegion[x].score;
        }
        response[i].value = touchPointCount / _scoreTouchPointByRegion.length;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var _scoreTouchPointByParent = await scoreTouchPointByParent(
      pid,
      'score',
      arrDealer
    );
    var total = 0;
    var response = 0;

    if (_scoreTouchPointByParent.length > 0) {
      for (let i = 0; i < _scoreTouchPointByParent.length; i++) {
        total = total + _scoreTouchPointByParent[i].score;
      }
      response = total / _scoreTouchPointByParent.length;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.getTouchPointScoreDealerTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var _getDealerByPid = await getDealerByPid(pid, city, arrDealer);

    var response = [];
    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push({
        idDealer: _getDealerByPid[i].idDealer,
        idCity: _getDealerByPid[i].idCity,
        dealerName: _getDealerByPid[i].dealerName,
        data: [],
      });
    }

    var parentTouchPoint = await getParentTouchPoint(pid);

    for (let i = 0; i < response.length; i++) {
      var _scoreTouchPointByParentDealer = await scoreTouchPointByParentDealer(
        pid,
        response[i].idDealer
      );
      var arrResult = [];
      if (_scoreTouchPointByParentDealer.length > 0) {
        for (let x = 0; x < _scoreTouchPointByParentDealer.length; x++) {
          var _findObj = await findObj(
            parentTouchPoint,
            'code',
            _scoreTouchPointByParentDealer[x].code
          );
          if (_findObj !== -1) {
            arrResult.push(_scoreTouchPointByParentDealer[x]);
          }
        }
        response[i].data = arrResult;
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreDealerSort = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var _getDealerByPid = await getDealerByPid(pid, city, arrDealer);
    var response = [];

    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push({
        idDealer: _getDealerByPid[i].idDealer,
        idCity: _getDealerByPid[i].idCity,
        dealerName: _getDealerByPid[i].dealerName,
        data: 0,
      });
    }

    var parentTouchPoint = await getParentTouchPoint(pid);

    for (let i = 0; i < response.length; i++) {
      var _scoreTouchPointByParent = await scoreTouchPointByParent(
        pid,
        'score',
        response[i].idDealer
      );
      if (_scoreTouchPointByParent.length > 0) {
        response[i].data = _scoreTouchPointByParent[0].score;
      }
    }
    bubbleSort(response, 'data');
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreDealerExport = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var dealer = await getDealerByFilter(pid, region, area, city, accessDealer);
    var arrDealer = dealer.map((data) => data.idDealer);

    var _getDealerByPid = await getDealerByPid(pid, city, arrDealer);
    var response = [];

    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push({
        idDealer: _getDealerByPid[i].idDealer,
        idCity: _getDealerByPid[i].idCity,
        dealerName: _getDealerByPid[i].dealerName,
        data: 0,
      });
    }

    var parentTouchPoint = await getParentTouchPoint(pid);

    for (let i = 0; i < response.length; i++) {
      var _scoreTouchPointByParent = await scoreTouchPointByParent(
        pid,
        'score',
        response[i].idDealer
      );
      if (_scoreTouchPointByParent.length > 0) {
        response[i].data = _scoreTouchPointByParent[0].score;
      }
    }
    bubbleSort(response, 'data');
    fs.writeFile(
      'public/filexls/' + newfilename,
      progress,
      function (errwritefile) {
        if (errwritefile) {
          console.log('error');
        } else {
          res.render('download', {
            newfilename: newfilename,
          });
        }
      }
    );
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
