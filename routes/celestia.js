const express = require('express');
const celestiaController = require('../controllers/celestia');
const Router = express.Router();

Router.get('/:pid/target', celestiaController.getTargetTotal);
Router.get('/:pid/achievement/panel', celestiaController.getAchievementPanel);
Router.get('/:pid/achievement/panel-slices', celestiaController.getAchievementPanelSlices);
Router.get('/:pid/achievement/total', celestiaController.getAchievementPanelTotal);

Router.get('/:pid/achievement/region', celestiaController.getAchievementRegion);

Router.get('/:pid/rawdata/list', celestiaController.getRawdataList);
Router.get('/:pid/rawdata/get/:id', celestiaController.getRawdataDetail);

Router.get('/:pid/evidence/get/:id', celestiaController.getEvidenceDetail);

//administrations
Router.get('/:pid/administration/region/list', celestiaController.getAdministrationRegion);
Router.get('/:pid/administration/region/get/:panel/:region', celestiaController.getAdministrationRegionDetail);

//import
Router.post('/:pid/import/:panel/rawdata', celestiaController.postImportRawdata);
Router.post('/:pid/import/:panel/rawdata-update', celestiaController.postImportRawdataUpdate);
Router.post('/:pid/import/:panel/evidence', celestiaController.postImportEvidence);

//export
Router.post('/:pid/export/panel', celestiaController.postExportPanel);
Router.post('/:pid/export/rawdata', celestiaController.postExportRawdata);

module.exports = Router;