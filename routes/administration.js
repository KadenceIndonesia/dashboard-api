const express = require('express');
const administrationController = require('../controllers/administration');
const Router = express.Router();

Router.get('/:pid/region/list', administrationController.getRegion);
Router.get('/:pid/province/list', administrationController.getProvinces);
Router.get('/:pid/city/list', administrationController.getCityListAll);
Router.get('/:pid/city/total', administrationController.getCityTotal);
Router.get('/:pid/city/list/:province', administrationController.getCityListProvince);
Router.get('/:pid/helper/total', administrationController.getHelperTotal);

Router.get('/:pid/sensus/all', administrationController.getSensusAll);
Router.get('/:pid/sensus/latlong', administrationController.getSensusLatLong);
Router.get('/:pid/sensus/detail/:id', administrationController.getSensusDetailByID);

Router.get('/:pid/directorate/list', administrationController.getDirectorateList);
Router.get('/:pid/directorate/get/:id', administrationController.getDirectorateDetail);

Router.get('/:pid/panel/list', administrationController.getPanelList);
Router.get('/:pid/panel/get/:id', administrationController.getPanelDetail);

module.exports = Router;
