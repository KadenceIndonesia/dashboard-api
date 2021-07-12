const express = require("express");
const projectControllers = require("../controllers/project")
const Router = express()
const Project = require("../models/project")

Router.get("/", projectControllers.getProject);
Router.get("/:pid", projectControllers.getProjectByPid);
Router.post("/create", projectControllers.postCreateProject);


module.exports = Router;