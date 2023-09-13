//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Category = models.category;
const Product = models.product;
const Stock = models.stock;
const StockDetails = models.stock_details;
const PriceDetails = models.price_details;
const stockController = {
    getAll: async (req, res) => {
        try {

            const result = await Stock.findAll();

            return res.json({ "status": "success", "data": { items: result } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    create: async (req, res) => {
        try {
            let cuttentQuantity = 0;
            let stock_id;
            const { product_id, color_id, description, type, quantity } = req.body;
            if (!(product_id && color_id && quantity && description && type)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const stockData = await Stock.findOne({ where: { product_id, color_id } });

            if (stockData) {
                cuttentQuantity = stockData.quantity;
                const result = await Stock.update(
                    { quantity: (type == "add" ? cuttentQuantity + quantity : cuttentQuantity - quantity) },
                    { where: { product_id, color_id } }
                );
                //return res.status(200).json({ "status": "success", "message": "Stock updated" });
                stock_id = stockData.id;
            } else {
                const stock = await Stock.create({ product_id, color_id, quantity, created_by: req.user.id });
                stock_id = stock.id;
            }
            console.log({
                stock_id, description, type, quantity, cuttentQuantity, created_by: req.user.id
            });
            let ress = stockController.updateStockDetails({
                stock_id, description, type, quantity_in: quantity, quantity_before_update: cuttentQuantity, created_by: req.user.id
            });


            return res.json({ status: "success", "message": "Stock Added" });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    update: async (req, res) => {
        // try {

        //     const { product_name, category_id } = req.body;
        //     const id = req.params.id;
        //     if (!(product_name && category_id)) {
        //         return res.status(422).json({ "status": "error", "message": "Invalid form data" });
        //     }
        //     const dbData = await Product.findOne({ where: { product_name } });
        //     //const dbDataById = await Category.findOne({ where: { id } });
        //     if (dbData && dbData.id != id) {
        //         return res.status(422).json({ "status": "error", "message": "Product already exists" });
        //     }

        //     const formData = {
        //         product_name,
        //         category_id
        //     };

        //     const result = await Product.update(
        //         formData,
        //         { where: { id } }
        //     )

        //     return res.json({ status: "success", "message": "Updated", data: { id, product_name } });
        // } catch (err) {
        //     logger.error(err);
        //     console.log(err);
        //     return res.status(500).json({ "status": "error" });
        // }

    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const dbData = await Product.findOne({ where: { id } });
            if (!dbData) {
                return res.status(404).json({ "status": "error", "message": "Not found" });
            }

            const result = await Product.destroy({
                where: {
                    id
                }
            });

            return res.json({ status: "success", "message": "Deleted", data: {} });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    updateStockDetails: async (data) => {
        try {
            let { stock_id, description, type, quantity_in, quantity_before_update, created_by } = data;
            let quantity_after_update;

            quantity_after_update = (type == "add" ? quantity_before_update + quantity_in : quantity_before_update - quantity_in);
            console.log({ stock_id, description, type, quantity_in, quantity_before_update, quantity_after_update, created_by })
            const result = await StockDetails.create({ stock_id, description, type, quantity_in, quantity_before_update, quantity_after_update, created_by });
            return result;
        } catch (err) {
            logger.error(err);
            console.log(err);
        }
    },


    addPriceRangeDetails: async (req, res) => {
        try {
            let { stock_id, quantity_start, quantity_end, price } = req.body;
            if (!(stock_id && quantity_start && quantity_end && price)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            let priceData = PriceDetails.findOne({ where: { stock_id, quantity_start, quantity_end, price } });
            if(priceData){
                return res.status(422).json({ "status": "error", "message": "Range already exists" });
            }
            let result = await PriceDetails.create({ stock_id, quantity_start, quantity_end, price, created_by: req.user.id });
            return res.json({ status: "success", "message": "Price Details Added" });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }
    }

}


module.exports = stockController;