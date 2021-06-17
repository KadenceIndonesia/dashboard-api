const express = require("express");
const apiControllers = require("../controllers/api")
const Router = express()

Router.get("/", apiControllers.getApi);
Router.get("/:pid", apiControllers.getApiProject);
Router.get("/:pid/access", apiControllers.getApiAccess);

module.exports = Router;