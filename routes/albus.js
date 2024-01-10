const express = require('express');
const albusController = require('../controllers/albus');
const Router = express.Router();

Router.get('/:pid/test', albusController.testController);
Router.get('/:pid/rawdata/service-point', albusController.rawdataServicePoint);


module.exports = Router;