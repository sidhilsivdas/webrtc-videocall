//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = models.customer;
const customerController = {
    getAll: async (req, res) => {
        try {

            const customers = await Customer.findAll();

            return res.json({ "status": "success", "data": {items: customers}});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    create: async (req, res) => {
        try {

            const { full_name, email, address, phone } = req.body;
            if (!(full_name && email && address && phone)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const customerData = await Customer.findOne({ where: { full_name } });
            if (customerData) {
                return res.status(422).json({ "status": "error", "message": "Customer already exists" });
            }
            
            const customer = await Customer.create({ full_name, email, address, phone, created_by:req.user.id });

            return res.json({ status: "success", "message": "Created", data: { id: customer.id, full_name, email, address, phone } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { full_name, email, address, phone } = req.body;
            if (!(full_name && email && address && phone)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const dbData = await Customer.findOne({ where: { full_name } });
            //const dbDataById = await Category.findOne({ where: { id } });
            if (dbData && dbData.id != id) {
                return res.status(422).json({ "status": "error", "message": "Customer already exists" });
            }

           

            const result = await Customer.update(
                { full_name, email, address, phone },
                { where: { id: req.params.id } }
            )

            return res.json({ status: "success", "message": "Customer Updated", data: { id: dbData.id, full_name, email, phone } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const userData = await Customer.findOne({ where: { id } });
            if (!userData) {
                return res.status(404).json({ "status": "error", "message": "Customer not found" });
            }

            const result = await Customer.destroy({
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

module.exports = customerController;