//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StocksDetails = models.stock_details;
const Request = models.request;
const Stock = models.stock;
const RequestDetails = models.request_details;
const Customer = models.customer;
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const dbConfig = require(`${__dirname}/../../config/database.js`)[env];
var pdf = require("pdf-creator-node");
var fs = require("fs");
const path = require('path');

const reportController = {
    generateReceipt: async (req, res) => {
        try {
          const id = req.params.id;
          //var html = fs.readFileSync("template.html", "utf8");
          let templatePathDir = path.join(__dirname, '..', 'public', 'index.html')
          //console.log(__dirname, templatePathDir);
          res.json({templatePathDir, dirname:__dirname});

        } catch (err) {

        }

    }
}

module.exports = reportController;