const express = require('express');
const hyundaiControllers = require('../controllers/hyundai');
const Router = express();

//hyundai kona koni
Router.get('/:pid/administration/get/region', hyundaiControllers.getHyundaiRegion);
Router.get('/:pid/administration/get/area', hyundaiControllers.getHyundaiArea);
Router.get('/:pid/administration/get/city', hyundaiControllers.getHyundaiCity);
Router.get('/:pid/administration/get/dealer', hyundaiControllers.getHyundaiDealer);

Router.get('/:pid/achievement/total', hyundaiControllers.getAchievementTotal);
Router.get('/:pid/achievement/group-region', hyundaiControllers.getAchievementGroupByRegion);
Router.get('/:pid/achievement/group-area', hyundaiControllers.getAchievementGroupByArea);

Router.get('/:pid/achievement/group-brand', hyundaiControllers.getAchievementGroupByBrand);
Router.get('/:pid/achievement/group-skenario', hyundaiControllers.getAchievementGroupBySkenario);


Router.get('/:pid/touchpoint/get/parent', hyundaiControllers.getTouchPointGroupParent);
Router.get('/:pid/touchpoint/get/child/:group', hyundaiControllers.getTouchPointChildGroup);

Router.get('/:pid/touchpoint/score/parent', hyundaiControllers.getTouchPointScoreParent);

module.exports = Router;