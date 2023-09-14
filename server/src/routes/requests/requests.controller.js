//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Request = models.request;
const RequestDetails = models.request_details;
const requestController = {
    getAll: async (req, res) => {
        try {

            const result = await Request.findAll();

            return res.json({ "status": "success", "data": {items: result}});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    create: async (req, res) => {
        try {

            const { customer_id, requests } = req.body;
            const id = req.params.id;
            if (!(customer_id && requests)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }

            if (!(Array.isArray(requests) && requests.length)) {
                return res.status(422).json({ "status": "error", "message": "Invalid requests data" });
            }

            let request = await Request.create({customer_id, created_by:req.user.id});
            let insertArr = [];
            requests.forEach(function (item, index) {
                insertArr.push({...item, request_id:request.id, created_by:req.user.id});
            });

            let insertRes = await RequestDetails.bulkCreate(insertArr);
            return res.json({ status: "success", "message": "Updated", data: {} });
           
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

module.exports = requestController;