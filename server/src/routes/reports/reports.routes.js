const express = require("express");
const reportController = require("./reports.controller");
const reportRouter = express.Router();

reportRouter.get("/generate-receipt/:id", reportController.generateReceipt);



module.exports = reportRouter;