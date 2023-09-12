//const planets = require("../../models/planets.model")
const models = require('../../models');
const logger = require('../../config/logger');
const config = require('../../config/config');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = models.user;
const authController = {
    loginUser: async (req, res) => {
        try {
            
            const  {email, password} = req.body;
            if(!(email && password)){
                return res.status(422).json({"status":"error","message":"Invalid form data"});
            }
            const userData = await User.findOne({ where: { email: email } });
            
            if (userData && (await bcrypt.compare(password, userData.password))) {
                const access_token = jwt.sign(
                    { id: userData.id, full_name:userData.full_name, email:email,role:userData.role },
                      config.jwt.secret,
                    {
                      //expiresIn: config.jwt.refreshExpirationDays,
                    }
                );
          
                const result = await User.update(
                    { access_token },
                    { where: { id: userData.id } }
                )
                return res.status(200).json({"status":"success","message":"Login success",data:{
                    access_token
                }});
              }
              

            
            return res.status(400).json({"status":"error","message":"Invalid credentials"});
        } catch (err) {
            logger.error(err);
            console.log(err);
            return res.json({"message":"error"});
        }

    }
}

module.exports = authController;