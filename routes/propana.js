const express = require('express');
const propanaController = require('../controllers/propana');
const Router = express.Router();

Router.get('/:pid/achievement/visit', propanaController.getVisitAchievement);

module.exports = Router;