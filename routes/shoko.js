const express = require("express")
const shokoController = require("../controllers/shoko");
const Router = express.Router();

Router.get("", shokoController.getIndexShoko);
Router.get("/user/list", shokoController.getUserList);
Router.get("/user/journey/:user", shokoController.getUserListJourney);
Router.get("/journey/:id", shokoController.getJourneyDetail);

module.exports = Router;