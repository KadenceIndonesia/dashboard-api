const express = require('express');
const clementineController = require('../controllers/clementine');
const Router = express.Router();

Router.get('/', clementineController.getIndex);
Router.get('/response', clementineController.getResponseFilter);
Router.get('/response/multiple', clementineController.getResponseFilterMultiple);
Router.get('/import/multi', clementineController.getImportDataMulti);
Router.get('/import/single', clementineController.getImportDataSingle);

module.exports = Router;