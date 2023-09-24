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

const requestController = {
    getAll: async (req, res) => {
        try {

            const Op = Sequelize.Op;
            let page = req.query.page;
            let perPage = req.query.perPage;
            let query = req.query.q;
            if (!(page && perPage)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            page = (page - 1) * perPage;

            let whereObj = {};
            let whereProdObj = {}
            if (req.query.customer_id) {
                whereObj.customer_id = +req.query.customer_id;
            }


            //console.log(whereProdObj)  


            const data = await Request.findAndCountAll({
                attributes: ['id', 'customer_id', 'created_at'],
                include: [{
                    model: Customer,
                    as: 'customer',
                    // where: whereProdObj
                }],
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
            const Op = Sequelize.Op;
            const { customer_id, requests } = req.body;
            const id = req.params.id;
            if (!(customer_id && requests)) {
                //console.log("here")
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }

            if (!Array.isArray(requests) || requests.length == 0) {
                //console.log("here1")
                return res.status(422).json({ "status": "error", "message": "Invalid requests data" });
            }

            let stockIds = requests.map(item => item.stock_id);
            //console.log(stockIds);
            let selectedStoks = await Stock.findAll({ where: { id: { [Op.in]: stockIds } } });

            //console.log(selectedStoks);
            let sequelize;
            if (dbConfig.use_env_variable) {
                sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
            } else {
                sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
            }

            const resultRes = await sequelize.transaction(async (t) => {

                let request = await Request.create({ customer_id: +customer_id, created_by: req.user.id }, { transaction: t });
                //let stock = await Stock.findOne({where: {stick_id: +requests[0].stock_id}});


                //let current_stock = stock.quantity;

                let insertArr = [];
                let stockDetailsArr = [];
                let stockUpdateArr = [];

                const statements = [];
                const tableName = "stocks";

                requests.forEach(function (item, index) {
                    let curStockItem = selectedStoks.find(it => it.id == item.stock_id);
                    //console.log(curStockItem, selectedStoks)
                    insertArr.push({
                        request_id: request.id,
                        stock_id: +item.stock_id,
                        request_item_id: +item.id,
                        quantity: +item.quantity,
                        price: +item.price,
                        created_by: req.user.id,
                        stock_quantity: item.stock_quantity
                    });
                    // insertArr.delete(id);


                    stockDetailsArr.push({
                        customer_id,
                        stock_id: +item.stock_id,
                        quantity_in: + item.quantity,
                        quantity_before_update: +item.stock_quantity,
                        quantity_after_update: (+item.stock_quantity - (+item.quantity)),
                        price: +item.price,
                        description: 'Sold',
                        type: "Sold"

                    })



                    stockUpdateArr.push({ id: +item.stock_id, quantity: (+item.stock_quantity - (+item.quantity)) });

                    statements.push(
                        sequelize.query(
                            `UPDATE ${tableName} 
                             SET quantity='${(+item.stock_quantity - (+item.quantity))}' 
                             WHERE id=${+item.stock_id};`
                            , { transaction: t })
                    );

                });

                // console.log(stockUpdateArr);


                let insertRes = await RequestDetails.bulkCreate(insertArr, { transaction: t });
                //let stockUpdateRes = await Stock.bulkCreate(stockUpdateArr, { updateOnDuplicate: ['quantity'] }, {transaction: t});
                let stockDetailsRes = await StocksDetails.bulkCreate(stockDetailsArr, { transaction: t });


                const resultPr = await Promise.all(statements);


            });

            return res.json({
                status: "success", "message": "Updated", data: {

                }
            });

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

    },

    getRequestDetails: async (req, res) => {
        try {
            const id = req.params.id;

            const reqData = await Request.findOne({where: { id }, include:[Customer]});

            const dbData = await RequestDetails.findAll({
                where: { request_id: +id },
                order: [['request_item_id','ASC']],
                include: [{
                    model: models.stock,
                    include: [{
                        model: models.product
                    },{
                        model: models.color
                    }]
                }]
            });
           

            return res.json({ "status": "success", "data": { reqData,items: dbData, totalCount: 0 } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }
    }
}

module.exports = requestController;