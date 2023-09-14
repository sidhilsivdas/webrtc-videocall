//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require("../../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = models.user;
const usersController = {
    getAllUsers: async (req, res) => {
        try {
            let page = +req.query.page;
            let perPage = +req.query.perPage;
            page = (page-1) * perPage;
            
            const users = await User.findAndCountAll({attributes: ['id','full_name', 'email', 'role', 'created_at'], where:{}, offset:page, limit:perPage});

            return res.json({ "status": "success", "data": {items: users.rows, totalCount:users.count}});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({ "status": "error" });
        }

    },
    createUser: async (req, res) => {
        try {

            const { full_name, email, password, role } = req.body;
            if (!(full_name && email && password && role)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const userData = await User.findOne({ where: { email: email } });
            if (userData) {
                return res.status(422).json({ "status": "error", "message": "Email already exists" });
            }
            let encryptedPassword = await bcrypt.hash(password, 10);
            const formData = {
                full_name,
                email,
                password: encryptedPassword,
                //access_token,
                role,
                created_by: +req.user.id
            };

            const user = await User.create(formData);

            const access_token = jwt.sign(
                { id: user.id, email },
                config.jwt.secret,
                {
                    //expiresIn: config.jwt.refreshExpirationDays,
                }
            );

            const result = await User.update(
                { access_token },
                { where: { id: user.id } }
            )


            return res.json({ status: "success", "message": "Created", data: { id: user.id, full_name, email, role } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    updateUser: async (req, res) => {
        try {
            const { full_name, email, password, role } = req.body;
            if (!(full_name && email && password && role)) {
                return res.status(422).json({ "status": "error", "message": "Invalid form data" });
            }
            const userData = await User.findOne({ where: { id: req.params.id } });
            const UserDataByEmail = await User.findOne({ where: { email: email } });

            if (!userData) {
                return res.status(404).json({ "status": "error", "message": "User not found" });
            }
            if (UserDataByEmail && userData.id != UserDataByEmail.id) {
                return res.status(422).json({ "status": "error", "message": "Email already exist" });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            const access_token = jwt.sign(
                { id: userData.id, email },
                config.jwt.secret,
                {
                    //expiresIn: config.jwt.refreshExpirationDays,
                }
            );

            const formData = {
                full_name,
                email,
                password: encryptedPassword,
                access_token,
                role

            };

            const result = await User.update(
                formData,
                { where: { id: req.params.id } }
            )

            return res.json({ status: "success", "message": "User Updated", data: { id: userData.id, full_name, email, role } });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    },

    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            const userData = await User.findOne({ where: { id } });
            if (!userData) {
                return res.status(404).json({ "status": "error", "message": "User not found" });
            }

            const result = await User.destroy({
                where: {
                    id
                }
            });

            return res.json({ status: "success", "message": "User Updated", data: {} });
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({ "status": "error" });
        }

    }
}

module.exports = usersController;