const express = require('express');
const administrationController = require('../controllers/administration');
const Router = express.Router();

Router.get('/:pid/region/list', administrationController.getRegion);
Router.get('/:pid/province/list', administrationController.getProvinces);
Router.get('/:pid/city/list', administrationController.getCityListAll);
Router.get('/:pid/city/total', administrationController.getCityTotal);
Router.get('/:pid/city/list/:province', administrationController.getCityListProvince);
Router.get('/:pid/helper/total', administrationController.getHelperTotal);

module.exports = Router;
