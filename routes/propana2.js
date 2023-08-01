const express = require('express');
const propanaController = require('../controllers/propana2');
const Router = express.Router();

Router.get('/:pid/achievement/visit', propanaController.getVisitAchievement); //S0
Router.get('/:pid/achievement/visit-by-date', propanaController.getVisitAchievementByDate); //S0
Router.get('/:pid/achievement/status-visit', propanaController.getStatusVisitAchievement); //A6A7
Router.get('/:pid/achievement/status-visit-percent', propanaController.getStatusVisitAchievementPercent); //A6A7
Router.get('/:pid/achievement/visit-region', propanaController.getVisitByRegion); // done
Router.get('/:pid/achievement/visit-province', propanaController.getVisitByProvince);
Router.get('/:pid/achievement/visit-city', propanaController.getVisitByCity);
Router.get('/:pid/achievement/status-pangkalan', propanaController.getStatusPangkalan);
Router.get('/:pid/achievement/status-boarding-pangkalan', propanaController.getStatusOnBoardingPangkalan); //A12A113
Router.get('/:pid/achievement/help-boarding', propanaController.getHelpBoardingPangkalan); //A31 //Done
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
Router.get('/:pid/status-pangkalan/export', propanaController.getStatusPangkalanExport);

//progress
Router.get('/:pid/progress/not-boarding', propanaController.getProgressNotBoarding);
Router.get('/:pid/progress/on-boarding-transaction', propanaController.getProgressOnBoardingTransaction);


module.exports = Router;