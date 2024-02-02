const express = require('express');
const hakkinenController = require('../controllers/hakkinen');
const Router = express.Router();

Router.get('/:pid/test', hakkinenController.testController);
Router.post('/:pid/duration/update', hakkinenController.postDurationUpdate);

module.exports = Router;
