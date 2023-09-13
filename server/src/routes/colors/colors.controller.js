//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Color = models.color;
const colorController = {
    getAll: async (req, res) => {
        try {

            const result = await Color.findAll();

            return res.json({ "status": "success", "data": {items: result}});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    create: async (req, res) => {
        try {

            const { color_name } = req.body;
            if (!color_name) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Color.findOne({ where: { color_name } });
            if (dbData) {
                return res.status(422).json({ "status": "error", "message": "Color already exists" });
            }
            
            const formData = {
                color_name,
                created_by:req.user.id
            };

            const color = await Color.create(formData);

            return res.json({ status: "success", "message": "Created", data: { id: color.id, color_name } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    update: async (req, res) => {
        try {

            const { color_name } = req.body;
            const id = req.params.id;
            if (!color_name) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Color.findOne({ where: { color_name } });
            //const dbDataById = await Category.findOne({ where: { id } });
            if (dbData && dbData.id != id) {
                return res.status(422).json({ "status": "error", "message": "Color already exists" });
            }
            
            const formData = {
                color_name
            };

            const result = await Color.update(
                formData,
                { where: { id } }
            )

            return res.json({ status: "success", "message": "Updated", data: { id, color_name } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const dbData = await Color.findOne({ where: { id } });
            if (!dbData) {
                return res.status(404).json({ "status": "error", "message": "User not found" });
            }

            const result = await Color.destroy({
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

module.exports = colorController;