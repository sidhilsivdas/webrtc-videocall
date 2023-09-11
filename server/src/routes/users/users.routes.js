const express = require("express");
const usersController = require("./users.controller");
const usersRouter = express.Router();

usersRouter.get("/", usersController.getAllUsers);
//launchesRouter.post("/", launchesController.addLaunch);
//launchesRouter.delete("/:launchId", launchesController.abortLaunch);

module.exports = usersRouter;