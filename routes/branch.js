const express = require('express');
const branchController = require('../controllers/branch');
const Router = express.Router();

Router.get('/:pid/list', branchController.getBranchList);
Router.get(
  '/:pid/get/rawdata/:rawdata',
  branchController.getBranchDetailByRawdata
);
Router.get(
  '/:pid/list/compare-rawdata',
  branchController.getBranchListCompareWithData
);

module.exports = Router;
