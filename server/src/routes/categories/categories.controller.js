//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Category = models.category;
const categoryController = {
    getAll: async (req, res) => {
        try {

            const result = await Category.findAll();

            return res.json({ "status": "success", "data": {items: result}});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    create: async (req, res) => {
        try {

            const { category_name } = req.body;
            if (!category_name) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Category.findOne({ where: { category_name } });
            if (dbData) {
                return res.status(422).json({ "status": "error", "message": "Category already exists" });
            }
            
            const formData = {
                category_name,
                created_by:req.user.id
            };

            const category = await Category.create(formData);

            return res.json({ status: "success", "message": "Created", data: { id: category.id, category_name } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    update: async (req, res) => {
        try {

            const { category_name } = req.body;
            const id = req.params.id;
            if (!category_name) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Category.findOne({ where: { category_name } });
            //const dbDataById = await Category.findOne({ where: { id } });
            if (dbData && dbData.id != id) {
                return res.status(422).json({ "status": "error", "message": "Category already exists" });
            }
            
            const formData = {
                category_name
            };

            const result = await Category.update(
                formData,
                { where: { id } }
            )

            return res.json({ status: "success", "message": "Updated", data: { id, category_name } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const dbData = await Category.findOne({ where: { id } });
            if (!dbData) {
                return res.status(404).json({ "status": "error", "message": "User not found" });
            }

            const result = await Category.destroy({
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

    }
}

module.exports = categoryController;