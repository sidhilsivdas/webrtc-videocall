//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const User = models.user;
const usersController = {
    getAllUsers: async (req, res) => {
        try {
            console.log("hey")
            const user = await User.create({
                full_name: "Sidhil Sivadas M",
                email: "test@test.com",
                password: '112233',
                access_token: 'ddd',
                role:'admin'
            });

            return res.json(user);
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({"message":"error"});
        }

    }
}

module.exports = usersController;