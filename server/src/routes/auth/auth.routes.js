const express = require("express");
const authController = require("./auth.controller");
const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);
//launchesRouter.post("/", launchesController.addLaunch);
//launchesRouter.delete("/:launchId", launchesController.abortLaunch);

module.exports = authRouter;