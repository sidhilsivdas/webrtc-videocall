const express = require("express");
const colorController = require("./colors.controller");
const colorRouter = express.Router();

colorRouter.get("/", colorController.getAll);
colorRouter.post("/", colorController.create);
colorRouter.put("/:id", colorController.update);
colorRouter.delete("/:id", colorController.delete);


module.exports = colorRouter;