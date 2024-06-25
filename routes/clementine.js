const express = require('express');
const clementineController = require('../controllers/clementine');
const Router = express.Router();

Router.get('/', clementineController.getIndex);
Router.get('/response', clementineController.getResponseFilter);


module.exports = Router;