//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Category = models.category;
const Product = models.product;
const Sequelize = require("sequelize");

const productController = {
    getAll: async (req, res) => {
        
        try {
            const Op = Sequelize.Op;
            let page = req.query.page;
            let perPage = req.query.perPage;
            let query = req.query.q;
            if(!(page && perPage)){
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            page = (page - 1) * perPage;

            let whereObj = {};
            if(query){
                whereObj.product_name = { [Op.like]: `%${query}%` };
            }

            const data = await Product.findAndCountAll({
                attributes: ['id', 'category_id','product_name', 'created_at'],
                include:[Category],
                where: whereObj,
                order: [
                    ['id', 'DESC'],
                    //['name', 'ASC'],
                ], offset: +page, limit: +perPage
            });

            return res.json({ "status": "success", "data": { items: data.rows, totalCount: data.count } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    create: async (req, res) => {
        try {

            const { product_name, category_id } = req.body;
            if (!(product_name && category_id)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Product.findOne({ where: { product_name } });
            if (dbData) {
                return res.status(422).json({ "status": "error", "message": "Product already exists" });
            }
            
            const formData = {
                product_name,
                category_id,
                created_by:req.user.id
            };

            const product = await Product.create(formData);

            return res.json({ status: "success", "message": "Created", data: { id: product.id, product_name } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    update: async (req, res) => {
        try {

            const { product_name, category_id } = req.body;
            const id = req.params.id;
            if (!(product_name && category_id)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Product.findOne({ where: { product_name } });
            //const dbDataById = await Category.findOne({ where: { id } });
            if (dbData && dbData.id != id) {
                return res.status(422).json({ "status": "error", "message": "Product already exists" });
            }
            
            const formData = {
                product_name,
                category_id
            };

            const result = await Product.update(
                formData,
                { where: { id } }
            )

            return res.json({ status: "success", "message": "Updated", data: { id, product_name } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

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

    
}

module.exports = productController;