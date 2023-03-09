const express = require('express');
const hyundaiControllers = require('../controllers/hyundai');
const Router = express();

//hyundai kona koni
Router.get('/:pid/region/get', hyundaiControllers.getHyundaiRegion);
Router.get('/:pid/area/get', hyundaiControllers.getHyundaiArea);
Router.get('/:pid/city/get', hyundaiControllers.getHyundaiCity);
Router.get('/:pid/dealer/get', hyundaiControllers.getHyundaiDealer);
module.exports = Router;