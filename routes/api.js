const express = require("express");
const apiControllers = require("../controllers/api")
const textMiningControllers = require("../controllers/textMining")
const Router = express()
const Project = require("../models/project")

Router.get("/", apiControllers.getApi);
Router.get("/:pid", apiControllers.getApiProject);
Router.get("/:pid/data/:qidx", apiControllers.getApiData);
Router.get("/:pid/data/:qidx/topbreak", apiControllers.getDataTopbreak);
Router.get("/:pid/data/:qidx/slice", apiControllers.getSliceData);
Router.get("/:pid/data/:qidx/attribute", apiControllers.getAttributeData);
Router.get("/:pid/data/:qidx/break/:break/:code", apiControllers.getDataByBreak);
Router.post("/:pid/data/:qidx/break/", apiControllers.dataByBreak);
Router.get("/:pid/topbreak/:qidx", apiControllers.getTopBreak);


// text mining
Router.get("/:pid/textmining/:qidx/save/", textMiningControllers.textMining);
Router.get("/:pid/textmining/:qidx/read", textMiningControllers.textMiningRead);



module.exports = Router;