const express = require('express');
const administrationController = require('../controllers/administration');
const Router = express.Router();

Router.get('/:pid/province/list', administrationController.getProvinces);
Router.get('/:pid/city/list', administrationController.getCityListAll);
Router.get('/:pid/city/list/:province', administrationController.getCityListProvince);

module.exports = Router;
