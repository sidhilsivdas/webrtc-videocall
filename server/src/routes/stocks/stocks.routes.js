const express = require("express");
const stockController = require("./stocks.controller");
const stockRouter = express.Router();

stockRouter.get("/", stockController.getAll);
stockRouter.post("/", stockController.create);
stockRouter.put("/:id", stockController.update);
stockRouter.delete("/:id", stockController.delete);
stockRouter.post("/add-price-range-details", stockController.addPriceRangeDetails);
stockRouter.get("/get-stock-history/:id", stockController.getStockHistory);



module.exports = stockRouter;