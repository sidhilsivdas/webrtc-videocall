const express = require("express");
const categoryController = require("./categories.controller");
const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAll);
categoryRouter.post("/", categoryController.create);
categoryRouter.put("/:id", categoryController.update);
categoryRouter.delete("/:id", categoryController.delete);


module.exports = categoryRouter;