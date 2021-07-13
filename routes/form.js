const express = require("express")
const Router = express()
const formControllers = require("../controllers/form")

Router.get("/", formControllers.getForm)

module.exports = Router