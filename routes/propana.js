const express = require('express');
const propanaController = require('../controllers/propana');
const Router = express.Router();

Router.get('/:pid/achievement/visit', propanaController.getVisitAchievement);
Router.get('/:pid/achievement/status-visit', propanaController.getStatusVisitAchievement);
Router.get('/:pid/achievement/status-visit-percent', propanaController.getStatusVisitAchievementPercent);
Router.get('/:pid/achievement/visit-region', propanaController.getVisitByRegion);
Router.get('/:pid/achievement/visit-city', propanaController.getVisitByCity);
Router.get('/:pid/achievement/status-boarding-pangkalan', propanaController.getStatusOnBoardingPangkalan);
Router.get('/:pid/achievement/help-boarding', propanaController.getHelpBoardingPangkalan);
Router.get('/:pid/sort/boarding/:type', propanaController.getSortBoarding);

Router.get('/:pid/achievement/poster', propanaController.getPosterAchievement);
Router.get('/:pid/achievement/poster-view', propanaController.getPosterViewAchievement);
Router.get('/:pid/sort/poster/:type', propanaController.getSortPoster);

Router.get('/:pid/achievement/device-total', propanaController.getAchievementDeviceTotal);
Router.get('/:pid/achievement/device-type', propanaController.getAchievementDeviceType);

Router.get('/:pid/pangkalan/target', propanaController.getTargetPangkalan);
Router.get('/:pid/pangkalan/data-list', propanaController.getTotalListPangkalan);

Router.get('/:pid/pangkalan/list', propanaController.getDataListPangkalan);
Router.get('/:pid/pangkalan/detail/:key', propanaController.getDetailPangkalan);

module.exports = Router;