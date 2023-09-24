const express = require("express");
const requestController = require("./requests.controller");
const requestRouter = express.Router();

requestRouter.get("/", requestController.getAll);
requestRouter.get("/:id", requestController.getAll);
requestRouter.post("/", requestController.create);
requestRouter.put("/:id", requestController.update);
requestRouter.delete("/:id", requestController.delete);

//request-details
requestRouter.get("/request-details/:id", requestController.getRequestDetails);


module.exports = requestRouter;