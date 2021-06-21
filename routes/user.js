const express = require("express")
const userController = require("../controllers/user");
const Router = express.Router();

Router.post("/:pid/create", userController.postCreateUser);
Router.get("/:pid/:email", userController.getUser);


module.exports = Router;