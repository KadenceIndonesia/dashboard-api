const express = require("express");
const apiControllers = require("../controllers/api")
const Router = express()
const Project = require("../models/project")

Router.get("/", apiControllers.getApi);
Router.get("/:pid", apiControllers.getApiProject);
Router.get("/:pid/data/:qidx", apiControllers.getApiData);
Router.get("/:pid/data/:qidx/slice", apiControllers.getSliceData);

module.exports = Router;