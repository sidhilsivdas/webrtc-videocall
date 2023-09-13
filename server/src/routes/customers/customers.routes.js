const express = require("express");
const customerController = require("./customers.controller");
const customerRouter = express.Router();

customerRouter.get("/", customerController.getAll);
customerRouter.post("/", customerController.create);
customerRouter.put("/:id", customerController.update);
customerRouter.delete("/:id", customerController.delete);



module.exports = customerRouter;