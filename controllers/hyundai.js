const Project = require('../models/project');
const Attribute = require('../models/attributes');
const Report = require('../models/reports');
const Projects = require('../models/project');
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');
const attributes = require('../models/attributes');
const jwt = require('jsonwebtoken');
require('../lib/hyundai');

exports.getHyundaiRegion = async function (req, res) {
  try {
    const pid = req.params.pid;

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _groupingCityByDealer = await groupingCityByDealer(
      pid,
      accessDealerByProject
    );
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
    const pid = req.params.pid;
    const region = req.query.region;

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _groupingCityByDealer = await groupingCityByDealer(
      pid,
      accessDealerByProject,
      parseInt(region)
    );
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
    const pid = req.params.pid;
    const area = req.query.area;

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _groupingCityByDealer = await groupingCityByDealer(
      pid,
      accessDealerByProject
    );
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
    const pid = req.params.pid;
    const city = req.query.city;

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _getDealerByPid = await getDealerByPid(
      pid,
      city,
      accessDealerByProject
    );
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
    const pid = req.params.pid;
    const city = req.query.city;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _getDealerByPid = await getDealerByPid(
      pid,
      city,
      accessDealerByProject
    );
    var response = [];
    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push(_getDealerByPid[i]);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiDealerDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const dealer = req.params.idDealer;
    var _getDealerByIdDealer = await getDealerByIdDealer(pid, dealer);
    var response = _getDealerByIdDealer[0];
    res.status(200).json({
      statusCode: 200,
      message: 'Success get Dealer By ID',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getHyundaiDealerFilter = async function (req, res) {
  try {
    const pid = req.params.pid;
    const region = req.query.region;
    const area = req.query.area;
    const city = req.query.city;
    const qDealer = req.query.dealer;

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _getDealerByPid = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject
    );
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
    const pid = req.params.pid;
    const quest = pid === 'IDE3358' ? 'dealer' : 'DEALER';

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    const quarter = req.query.quarter;
    var data = await excelData(pid);
    var count = 0;
    for (let i = 0; i < data.length; i++) {
      if (accessDealerByProject.indexOf(data[i][quest]) !== -1) {
        if (quarter && parseInt(data[i]['Quartal']) === parseInt(quarter)) {
          count++;
        }
        if (!quarter) {
          count++;
        }
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

exports.getAchievementGroupByQuarter = async function (req, res) {
  try {
    const authHeaders = req.headers.userid;
    const detailUser = await getUserById(authHeaders);
    var accessDealer = detailUser.access;
    var response = [];

    const pid = req.params.pid;
    var data = await excelData(pid);
    var kodeAttributeSTG = 'Quartal';

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

exports.getAchievementGroupByRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    const questRegion = pid === 'IDE3358' ? 'region' : 'REGION';

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _groupingCityByDealer = await groupingCityByDealer(
      pid,
      accessDealerByProject
    );
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

    const quarter = req.query.quarter;
    var data = await excelData(pid);
    for (let i = 0; i < data.length; i++) {
      var _findObj = await findObj(response, 'id', data[i][questRegion]);
      if (_findObj !== -1) {
        if (quarter && parseInt(quarter) === parseInt(data[i]['Quartal'])) {
          response[_findObj].value = response[_findObj].value + 1;
        }

        if (!quarter) {
          response[_findObj].value = response[_findObj].value + 1;
        }
      }
    }
    bubbleSort(response, 'id');
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
    const pid = req.params.pid;
    const region = req.query.region;

    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _groupingCityByDealer = await groupingCityByDealer(
      pid,
      accessDealerByProject
    );
    var _groupingAreaByCity = await groupingAreaByCity(
      pid,
      _groupingCityByDealer
    );

    var _getAreaByPid = await getAreaByPid(pid, region, _groupingAreaByCity);
    var response = [];
    // array region to response
    for (let i = 0; i < _getAreaByPid.length; i++) {
      response.push({
        id: _getAreaByPid[i].idArea,
        label: _getAreaByPid[i].areaName,
        value: 0,
      });
    }
    const quarter = req.query.quarter;
    var data = await excelData(pid);

    for (let i = 0; i < data.length; i++) {
      var areaByDealer = await getAreaByCity(pid, data[i]['S0']);
      var _findObj = await findObj(response, 'id', areaByDealer[0].idArea);
      if (_findObj !== -1) {
        if (quarter && parseInt(quarter) === parseInt(data[i]['Quartal'])) {
          response[_findObj].value = response[_findObj].value + 1;
        }

        if (!quarter) {
          response[_findObj].value = response[_findObj].value + 1;
        }
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
    const quarter = req.query.quarter;
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
        if (quarter && parseInt(quarter) === parseInt(data[i]['Quartal'])) {
          response[_findObj].value = response[_findObj].value + 1;
        }
        if (!quarter) {
          response[_findObj].value = response[_findObj].value + 1;
        }
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
    const quarter = req.query.quarter;
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
        if (quarter && parseInt(quarter) === parseInt(data[i]['Quartal'])) {
          response[_findObj].value = response[_findObj].value + 1;
        }
        if (!quarter) {
          response[_findObj].value = response[_findObj].value + 1;
        }
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
    const qDealer = req.query.dealer;
    const quarter = req.query.quarter;
    const brand = req.query.brand;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject,
      ['hyundai']
    );
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
        arrDealer,
        quarter,
        brand
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
    const qDealer = req.query.dealer;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject
    );
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
    const qDealer = req.query.dealer;
    const quarter = req.query.quarter;
    const brand = req.query.brand;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;
    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject,
      ['hyundai']
    );
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
    var base = [];
    if (parseInt(region) === 0) {
      for (let i = 0; i < regionArr.length; i++) {
        response.push({
          code: regionArr[i].idRegion,
          label: regionArr[i].regionName,
          value: 0,
        });
        base.push(80);
      }
      for (let i = 0; i < response.length; i++) {
        var _scoreTouchPointByRegion = await scoreTouchPointByRegion(
          pid,
          'score',
          response[i].code,
          quarter,
          brand
        );
        var touchPointCount = 0;
        if (_scoreTouchPointByRegion.length > 0) {
          for (let x = 0; x < _scoreTouchPointByRegion.length; x++) {
            touchPointCount =
              touchPointCount + _scoreTouchPointByRegion[x].score;
          }
          response[i].value = touchPointCount / _scoreTouchPointByRegion.length;
        }
      }
    } else {
      // cari angka region
      for (let i = 0; i < regionArr.length; i++) {
        if (regionArr[i].idRegion === parseInt(region)) {
          response.push({
            code: regionArr[i].idRegion,
            label: regionArr[i].regionName,
            value: 0,
          });
          base.push(80);
        }
      }
      for (let i = 0; i < response.length; i++) {
        var _scoreTouchPointByRegion = await scoreTouchPointByRegion(
          pid,
          'score',
          response[i].code,
          quarter,
          brand
        );
        var touchPointCount = 0;
        if (_scoreTouchPointByRegion.length > 0) {
          for (let x = 0; x < _scoreTouchPointByRegion.length; x++) {
            touchPointCount =
              touchPointCount + _scoreTouchPointByRegion[x].score;
          }
          response[i].value = touchPointCount / _scoreTouchPointByRegion.length;
        }
      }

      for (let i = 0; i < dealer.length; i++) {
        response.push({
          code: dealer[i].idDealer,
          label: dealer[i].dealerName,
          value: 0,
        });
        base.push(80);
      }
      for (let i = 0; i < response.length; i++) {
        var _scoreTouchPointByDealer = await scoreTouchPointByDelaer(
          pid,
          'score',
          response[i].code,
          quarter,
          brand
        );
        var touchPointCount = 0;
        if (_scoreTouchPointByDealer.length > 0) {
          for (let x = 0; x < _scoreTouchPointByDealer.length; x++) {
            touchPointCount =
              touchPointCount + _scoreTouchPointByDealer[x].score;
          }
          response[i].value = touchPointCount / _scoreTouchPointByDealer.length;
        }
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
      base: base,
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
    const qDealer = req.query.dealer;
    const quarter = req.query.quarter;
    const brand = req.query.brand;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject,
      ['hyundai']
    );
    var arrDealer = dealer.map((data) => data.idDealer);

    var _scoreTouchPointByParent = await scoreTouchPointByParent(
      pid,
      'score',
      arrDealer,
      quarter,
      brand
    );
    var total = 0;
    var response = 0;
    var base = 0;

    if (_scoreTouchPointByParent.length > 0) {
      for (let i = 0; i < _scoreTouchPointByParent.length; i++) {
        base++;
        total = total + _scoreTouchPointByParent[i].score;
      }
      response = total / _scoreTouchPointByParent.length;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success get touchpoint score parent',
      data: response,
      base: base,
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
    const qDealer = req.query.dealer;
    const quarter = req.query.quarter;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject,
      ['hyundai']
    );
    var arrDealer = dealer.map((data) => data.idDealer);

    var _getDealerByPid = await getDealerByPid(pid, city, arrDealer);

    var response = [];
    for (let i = 0; i < _getDealerByPid.length; i++) {
      response.push({
        idDealer: _getDealerByPid[i].idDealer,
        task: _getDealerByPid[i].task,
        idCity: _getDealerByPid[i].idCity,
        dealerName: _getDealerByPid[i].dealerName,
        data: [],
      });
    }

    var parentTouchPoint = await getParentTouchPoint(pid);

    for (let i = 0; i < response.length; i++) {
      var _scoreTouchPointByParentDealer = await scoreTouchPointByParentDealer(
        pid,
        response[i].idDealer,
        quarter
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
    const qDealer = req.query.dealer;
    const quarter = req.query.quarter;
    const brand = req.query.brand;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject,
      ['hyundai']
    );

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
        response[i].idDealer,
        quarter,
        brand
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
    const qDealer = req.query.dealer;
    //users
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var dealer = await getDealerByFilter(
      pid,
      region,
      area,
      city,
      qDealer,
      accessDealerByProject,
      ['hyundai']
    );
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

    var isifile = [];
    for (let i = 0; i < response.length; i++) {
      if (response[i].data.length > 0) {
        var tempFile = [
          response[i].dealerName,
          response[i].data[0].score,
          response[i].data[1].score,
          response[i].data[2].score,
          response[i].data[3].score,
          response[i].data[4].score,
          response[i].data[5].score,
          response[i].data[6].score,
          response[i].data[7].score,
          response[i].data[8].score,
          response[i].data[9].score,
          response[i].data[10].score,
        ];
        isifile.push(tempFile);
      }
    }
    var header = [['Dealer Name']];
    var isiHeader = parentTouchPoint.map((data) => data.label);
    var createHeader = [header[0].concat(isiHeader)];
    var formatdate = moment().format('YYYY_MM_DD_HH_mm_ss');
    var newfilename = `${pid}_${formatdate}.xlsx`;
    // var newfilename = type + '_' + formatdate + '.xlsx';
    var createfile = createHeader.concat(isifile);
    const progress = xlsx.build([{ name: 'Data', data: createfile }]);
    fs.writeFile(
      `public/fileexcel/${newfilename}`,
      progress,
      function (errwritefile) {
        if (errwritefile) {
          console.log('error');
        } else {
          console.log('tidak error');
          res.status(200).json({
            statusCode: 200,
            message: 'Success get touchpoint score parent',
            data: `https://dashboard.kadence.co.id/fileexcel/${newfilename}`,
          });
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreDealerDetail = async function (req, res) {
  try {
    const pid = req.params.pid;
    const dealer = req.params.dealerId;
    //auth
    // const authHeaders = req.headers.userid; // headers userid
    // const detailUser = await getUserById(authHeaders); // get detail user by headers
    // var accessDealer = detailUser.access; // array access dealer
    // var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    // var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    var _response = [];
    var response = [];
    var _scoreTouchPointByDealer = await scoreTouchPointByDealer(pid, dealer);
    for (let i = 0; i < _scoreTouchPointByDealer.length; i++) {
      _response.push({
        code: _scoreTouchPointByDealer[i].code,
        label: _scoreTouchPointByDealer[i].label,
        group: _scoreTouchPointByDealer[i].group,
        value: _scoreTouchPointByDealer[i].score,
      });
    }
    if (pid === 'IDE3358') {
      for (let i = 0; i <= 10; i++) {
        var arrResponse = [];
        for (let x = 0; x < _response.length; x++) {
          if (parseInt(_response[x].group) === i) {
            arrResponse.push({
              code: _response[x].code,
              label: _response[x].label,
              group: _response[x].group,
              value: _response[x].value,
            });
          }
        }
        response.push(arrResponse);
      }
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get dealer detail score',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTouchPointScoreDealerDetailParent = async function (req, res) {
  try {
    const pid = req.params.pid;
    const dealer = req.params.dealerId;
    //auth
    const authHeaders = req.headers.userid; // headers userid
    const detailUser = await getUserById(authHeaders); // get detail user by headers
    var accessDealer = detailUser.access; // array access dealer
    var getObjectAccessDealer = await findObj(accessDealer, 'idProject', pid); // find project in access dealer
    // var accessDealerByProject = accessDealer[getObjectAccessDealer].data;

    // get parent
    var _getParentTouchPoint = await getParentTouchPoint(pid);
    var arrayParent = _getParentTouchPoint.map((data) => data.code);

    var response = [];
    var _scoreTouchPointParentDealerByCode =
      await scoreTouchPointParentDealerByCode(pid, dealer, arrayParent);
    for (let i = 0; i < _scoreTouchPointParentDealerByCode.length; i++) {
      response.push({
        code: _scoreTouchPointParentDealerByCode[i].code,
        label: _scoreTouchPointParentDealerByCode[i].label,
        group: _scoreTouchPointParentDealerByCode[i].group,
        value: _scoreTouchPointParentDealerByCode[i].score,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success get dealer detail score',
      data: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
