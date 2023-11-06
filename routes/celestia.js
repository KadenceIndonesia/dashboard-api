const express = require('express');
const celestiaController = require('../controllers/celestia');
const Router = express.Router();

Router.get('/:pid/target', celestiaController.getTargetTotal);
Router.get('/:pid/achievement/panel', celestiaController.getAchievementPanel);
Router.get('/:pid/achievement/total', celestiaController.getAchievementPanelTotal);

//administrations
Router.get('/:pid/administration/region/list', celestiaController.getAdministrationRegion);
Router.get('/:pid/administration/region/get/:panel/:region', celestiaController.getAdministrationRegionDetail);


module.exports = Router;