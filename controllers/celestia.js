const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');

require('../lib/index');
require('../lib/administration');
exports.getTarget = async function (req, res) {
    try {
      const pid = req.params.pid;
      const directorate = req.query.directorate;
      const panel = req.query.panel;
      const region = req.query.region;
      
      res.status(200).json({
        statusCode: 200,
        message: 'Success get Target',
        data: result,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.getTotalListPangkalan = async function (req, res) {
    try {
      const pid = req.params.pid;
      const region = req.query.region;
      const province = req.query.province;
      const city = req.query.city;
  
      var result = {
        dataList: 0,
        target: 0,
        percentage: 0,
      };
      if (region === '0') {
        if (province === '0') {
          var getDataCity = await getAdminstrationCityAll(pid);
        } else {
          if (city === '0') {
            var _getAdminstrationProvince = await getAdminstrationProvinceById(
              pid,
              province
            );
            var dataProvince = _getAdminstrationProvince.map(
              (data) => data.provinceName
            );
            var getDataCity = await getAdminstrationCityByArrayProvince(
              pid,
              dataProvince
            );
          } else {
            var getDataCity = await getAdminstrationCityByName(pid, city);
          }
        }
      } else {
        if (province === '0') {
          var _getAdminstrationProvince = await getAdminstrationProvinceByRegion(
            pid,
            region
          );
          var dataProvince = _getAdminstrationProvince.map(
            (data) => data.provinceName
          );
          var getDataCity = await getAdminstrationCityByArrayProvince(
            pid,
            dataProvince
          );
        } else {
          if (city === '0') {
            var getDataCity = await getAdminstrationCityByProvince(pid, province);
          } else {
            var getDataCity = await getAdminstrationCityByName(pid, city);
          }
        }
      }
  
      for (let i = 0; i < getDataCity.length; i++) {
        result.dataList = result.dataList + getDataCity[i].dataList;
        result.target = result.target + getDataCity[i].target;
      }
  
      result.percentage = (result.dataList / result.target) * 100;
  
      res.status(200).json({
        statusCode: 200,
        message: 'Success get Pangkalan Data List',
        data: result,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  };