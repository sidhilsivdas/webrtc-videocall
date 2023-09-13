const express = require("express");
const requestController = require("./requests.controller");
const requestRouter = express.Router();

requestRouter.get("/", requestController.getAll);
requestRouter.post("/", requestController.create);
requestRouter.put("/:id", requestController.update);
requestRouter.delete("/:id", requestController.delete);


module.exports = requestRouter;