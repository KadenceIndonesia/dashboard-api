const express = require('express');
const celestiaController = require('../controllers/celestia');
const Router = express.Router();

Router.get('/:pid/target', celestiaController.getTarget); //S0


module.exports = Router;