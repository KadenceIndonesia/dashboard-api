const express = require('express');
const speechToTextController = require('../controllers/speechToText');
const Router = express.Router();

Router.get('/test', speechToTextController.getSpeechToTextTest);

module.exports = Router;