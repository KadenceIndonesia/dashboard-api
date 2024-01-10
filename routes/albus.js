const express = require('express');
const albusController = require('../controllers/albus');
const Router = express.Router();

Router.get('/:pid/test', albusController.testController);
Router.get('/:pid/rawdata/service-point', albusController.rawdataServicePoint);
Router.get('/:pid/rawdata/branch', albusController.rawdataBranch);
Router.get('/:pid/rawdata/kyc', albusController.rawdataKYC);


module.exports = Router;