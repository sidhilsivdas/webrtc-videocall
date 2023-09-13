const express = require("express");
const productController = require("./products.controller");
const productRouter = express.Router();

productRouter.get("/", productController.getAll);
productRouter.post("/", productController.create);
productRouter.put("/:id", productController.update);
productRouter.delete("/:id", productController.delete);


module.exports = productRouter;