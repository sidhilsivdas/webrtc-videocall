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

    },
    createUser: async (req, res) => {
        try {
            console.log(req.user.id)
            const {full_name, email, password, role} = req.body;
            if(!(full_name && email && password && role)){
                return res.status(422).json({"status":"error","message":"Invalid form data"});
            }
            const userData = await User.findOne({ where: { email: email } });
            if(userData){
                return res.status(422).json({"status":"error","message":"Email already exists"});
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
                { userId: user.id, email },
                  config.jwt.secret,
                {
                  //expiresIn: config.jwt.refreshExpirationDays,
                }
            );

            const result = await User.update(
                { access_token },
                { where: { id: user.id } }
            )
            

            return res.json({status:"success","mesage":"Created",data:{userId:user.id, full_name, email, role}});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json({"message":"error"});
        }

    }
}

module.exports = usersController;