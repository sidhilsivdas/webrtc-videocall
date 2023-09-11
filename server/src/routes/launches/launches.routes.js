const express = require("express");
const launchesController = require("./launches.controller");
const launchesRouter = express.Router();

launchesRouter.get("/", launchesController.getAllLaunches);
//launchesRouter.post("/", launchesController.addLaunch);
//launchesRouter.delete("/:launchId", launchesController.abortLaunch);

module.exports = launchesRouter;