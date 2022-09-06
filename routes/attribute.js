const express = require("express");
const attributeControllers = require("../controllers/attribute")
const Router = express()
const Attribute = require("../models/attributes")

Router.post("/create", attributeControllers.createAttribute);


module.exports = Router;