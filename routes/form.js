const express = require("express")
const Router = express()
const formControllers = require("../controllers/form")

Router.get("/", formControllers.getForm)
Router.post("/hyundai/score", formControllers.postUploadScoreHyundai)
Router.get("/hyundai/score", formControllers.readRawdataHyundai)

module.exports = Router