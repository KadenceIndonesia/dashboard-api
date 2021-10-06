const express = require("express");
const apiControllers = require("../controllers/api")
const textMiningControllers = require("../controllers/textMining")
const topbreakControllers = require("../controllers/topbreak");
const achievementControllers = require("../controllers/achievement");
const customControllers = require("../controllers/custom");
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
Router.get("/:pid/topbreak/break/:qidx/", apiControllers.topbreakByBreak);


// text mining
Router.get("/:pid/textmining/:qidx/save/", textMiningControllers.textMining);
Router.get("/:pid/textmining/:qidx/read", textMiningControllers.textMiningRead);

// topbreak
Router.get("/topbreak/:pid/", topbreakControllers.getTopbreak);
Router.get("/topbreak/:pid/:qidx", topbreakControllers.getTopbreakByQidx);
Router.get("/topbreak/attribute/:pid/:qidx", topbreakControllers.getTopbreakAttributes);


//achievement
Router.get("/achievement/:pid/", achievementControllers.getAchievementData);
Router.get("/achievement/break/:pid", achievementControllers.achievementByTopbreak);
Router.get("/achievement/:pid/:qidx", achievementControllers.achievementByQidx);


//custom
Router.get("/custom/:pid/:qidx", customControllers.getCustomGroupData);


module.exports = Router;