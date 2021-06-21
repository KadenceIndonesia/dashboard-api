const express = require("express");
const apiControllers = require("../controllers/api")
const Router = express()
const Project = require("../models/project")

Router.get("/", apiControllers.getApi);
Router.post("/", apiControllers.postApi);
Router.get("/:pid", apiControllers.getApiProject);
Router.get("/:pid/data/:qidx", apiControllers.getApiData);

module.exports = Router;