const express = require('express');
const vehicleController = require('../controllers/vehicle');
const Router = express.Router();

Router.get('/:pid/test', vehicleController.testController);
Router.get('/:pid/list', vehicleController.getVehicleList);
Router.get('/:pid/detail/:number', vehicleController.getVehicleDetail);


module.exports = Router;