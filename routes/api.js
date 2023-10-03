const express = require('express');
const apiControllers = require('../controllers/api');
const textMiningControllers = require('../controllers/textMining');
const topbreakControllers = require('../controllers/topbreak');
const achievementControllers = require('../controllers/achievement');
const scoreControllers = require('../controllers/score');
const customControllers = require('../controllers/custom');
const splitControllers = require('../controllers/split');
const loggerControllers = require('../controllers/logger');
const Router = express();
const Project = require('../models/project');

Router.get('/', apiControllers.getApi);
Router.get('/:pid', apiControllers.getApiProject);
Router.get('/:pid/data/:qidx', apiControllers.getApiData);
Router.get('/:pid/data/:qidx/topbreak', apiControllers.getDataTopbreak);
Router.get('/:pid/data/:qidx/slice', apiControllers.getSliceData);
Router.get('/:pid/data/:qidx/looplabel', apiControllers.getLooplabelData);
Router.get('/:pid/data/:qidx/attribute', apiControllers.getAttributeData);
Router.get(
  '/:pid/data/:qidx/attribute/:code',
  apiControllers.getAttributeDataByCode
);
Router.get(
  '/:pid/data/:qidx/break/:break/:code',
  apiControllers.getDataByBreak
);
Router.get('/:pid/data/:qidx/break/', apiControllers.dataByBreak);

Router.get('/:pid/topbreak/:qidx', apiControllers.getTopBreak);
Router.get('/:pid/topbreak/break/:qidx/', apiControllers.topbreakByBreak);

// text mining
Router.get('/:pid/textmining/:qidx/save/', textMiningControllers.textMining);
Router.get('/:pid/textmining/:qidx/read', textMiningControllers.textMiningRead);

// topbreak
Router.get('/topbreak/:pid/', topbreakControllers.getTopbreak);
Router.get('/topbreak/:pid/:qidx', topbreakControllers.getTopbreakByQidx);
Router.get(
  '/topbreak/attribute/:pid/:qidx',
  topbreakControllers.getTopbreakAttributes
);

//achievement
Router.get('/achievement/:pid/', achievementControllers.getAchievementData);
Router.get(
  '/achievement/break/:pid',
  achievementControllers.achievementByTopbreak
);
Router.get('/achievement/:pid/:qidx', achievementControllers.achievementByQidx);
Router.get(
  '/achievement/:pid/:qidx/age-group',
  achievementControllers.achievementByQidxAgeGroup
);
Router.get(
  '/achievement/:pid/:qidx/age-average',
  achievementControllers.achievementByQidxAgeGroupAverage
);
Router.get(
  '/achievement/:pid/:qidx/percent-target',
  achievementControllers.achievementByQidxPercentTarget
);
Router.get(
  '/achievement/:pid/:qidx/percent-total',
  achievementControllers.achievementByQidxPercentTotal
);
Router.get(
  '/achievement/:pid/:qidx/grouping',
  achievementControllers.achievementByQidxGrouping
);
Router.get(
  '/achievement/:pid/:qidx/:filter/:value',
  achievementControllers.achievementByFilter
);

//custom
Router.get('/custom/:pid/:qidx', customControllers.getCustomGroupData);
Router.get('/custom/:pid/:qidx/nps/:break', customControllers.getNPSDataBreaks);
Router.get('/custom/:pid/:qidx/nps', customControllers.getNPSData);

//PROPANA
Router.get(
  '/propana/flexmonster/',
  customControllers.getDataPropanaFlexmonster
);
Router.get('/propana/flexmonster/detail', customControllers.getDetailPropana);
Router.get('/propana/filter-city/:id', customControllers.getFilterCityPropana);
Router.get(
  '/propana/filter-pangkalan/:id',
  customControllers.getFilterPangkalanPropana
);
Router.get(
  '/propana/filter-kelurahan/:id',
  customControllers.getFilterKelurahanPropana
);
Router.get('/propana/overview', customControllers.getOverviewPropana);
Router.get(
  '/propana/overview/achievement/:qidx',
  customControllers.getOverviewAchievementPropana
);
Router.get('/propana/achievement', customControllers.getAchievementPropana);
Router.get(
  '/propana/achievementquestion/age',
  customControllers.getOverviewAchievementAgePropana
);
Router.get(
  '/propana/achievementquestion/ses',
  customControllers.getOverviewAchievementSESPropana
);
Router.get(
  '/propana/achievementquestion/occupation',
  customControllers.getOverviewAchievementOccupationPropana
);
Router.get(
  '/propana/achievementquestion/kks',
  customControllers.getOverviewAchievementKKSPropana
);
Router.get(
  '/propana/achievementquestion/smartphone',
  customControllers.getOverviewAchievementSmartphonePropana
);
Router.get(
  '/propana/achievementquestion/mypertamina',
  customControllers.getOverviewAchievementMyPertaminaPropana
);
Router.get('/propana/status-rekrut', customControllers.getStatusRekrutPropana);

//average
Router.get('/score/average/:pid/:qidx/total', scoreControllers.getScoreAverage);
Router.get(
  '/score/average/:pid/:qidx/attribute/:attr',
  scoreControllers.getScoreAverageByAttribute
);
//score grid
Router.get(
  '/score/average/:pid/:qidx/total-grid',
  scoreControllers.getScoreAverageGrid
);
Router.get(
  '/score/average/:pid/:qidx/attribute-grid/:attr',
  scoreControllers.getScoreAverageByAttributeGrid
);

//spellbound
Router.get(
  '/:pid/flexmonster/:tom/:spont/:aided',
  customControllers.getDataSpellboundFlexmonster
);

//split
Router.post('/split/:pid', splitControllers.getSplitData);

Router.get('/propana/test', customControllers.getTestPropana);

//logger
Router.post('/logger/create', loggerControllers.postLoggers);
Router.post('/logger/create/many', loggerControllers.postLoggersMany);

module.exports = Router;
