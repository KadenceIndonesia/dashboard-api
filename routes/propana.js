const express = require('express');
const propanaController = require('../controllers/propana');
const Router = express.Router();

Router.get('/:pid/achievement/visit', propanaController.getVisitAchievement);
Router.get('/:pid/achievement/status-visit', propanaController.getStatusVisitAchievement); //done
Router.get('/:pid/achievement/status-visit-percent', propanaController.getStatusVisitAchievementPercent); //done
Router.get('/:pid/achievement/visit-region', propanaController.getVisitByRegion);
Router.get('/:pid/achievement/visit-city', propanaController.getVisitByCity);
Router.get('/:pid/achievement/status-boarding-pangkalan', propanaController.getStatusOnBoardingPangkalan); //done wave
Router.get('/:pid/achievement/help-boarding', propanaController.getHelpBoardingPangkalan); //done wave
Router.get('/:pid/sort/boarding/:type', propanaController.getSortBoarding); //done wave

// on boarding belum transaksi
Router.get('/:pid/achievement/boarding-no-transaction', propanaController.getOnBoardingNoTransaction); //done wave
Router.get('/:pid/sort/boarding-no-transaction/:type', propanaController.getSortBoardingTransaction); //done wave

Router.get('/:pid/achievement/poster', propanaController.getPosterAchievement); //done wave
Router.get('/:pid/achievement/poster-view', propanaController.getPosterViewAchievement); //done wave
Router.get('/:pid/sort/poster/:type', propanaController.getSortPoster); //done wave

Router.get('/:pid/achievement/device-total', propanaController.getAchievementDeviceTotal);
Router.get('/:pid/achievement/device-type', propanaController.getAchievementDeviceType);

Router.get('/:pid/pangkalan/target', propanaController.getTargetPangkalan);
Router.get('/:pid/pangkalan/data-list', propanaController.getTotalListPangkalan);

Router.get('/:pid/pangkalan/list', propanaController.getDataListPangkalan);
Router.get('/:pid/pangkalan/detail/:key', propanaController.getDetailPangkalan);

Router.get('/:pid/pangkalan/export', propanaController.getExportPangkalan);
Router.get('/:pid/city/export', propanaController.getExportCity);



module.exports = Router;