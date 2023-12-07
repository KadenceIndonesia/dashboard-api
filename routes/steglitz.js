const express = require('express');
const steglitzController = require('../controllers/steglitz');
const Router = express.Router();

Router.get('/:pid/test', steglitzController.testController);
Router.get('/:pid/score/country', steglitzController.getScoreCountry);
Router.get('/:pid/score/country-region', steglitzController.getScoreCountryRegion);
Router.get('/:pid/score/country-channel', steglitzController.getScoreCountryChannel);
Router.get('/:pid/score/channel', steglitzController.getScoreChannel);


module.exports = Router;