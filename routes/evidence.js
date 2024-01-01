const express = require('express');
const evidenceController = require('../controllers/evidence');
const Router = express.Router();

Router.get('/:pid/test', evidenceController.getEvidenceTest);
Router.get('/:pid/list/:id', evidenceController.getEvidenceList);
Router.get('/:pid/list-number/:id', evidenceController.getEvidenceListByNumber);
Router.get('/:pid/detail/:id', evidenceController.getEvidenceDetail);

module.exports = Router;
