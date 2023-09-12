const models = require('../models');
//const logger = require('../config/logger');
const User = models.user;

const adminAuth = async (req, res, next) => {
    try {
        console.log("ss", models.user)
        //logger.error({"hhhhh":"xxxx"});
        const accessToken = req.headers['access-token'];
        //console.log(accessToken)
        if(!accessToken){
            return res.status(401).json({"status":"error","message":"Invalid access token"});
        }
        const userData = await User.findOne({ where: { access_token: accessToken } });
        if (!userData) {
            return res.status(401).json({"status":"error","message":"Invalid access token"});
        } else {
            req.user = {};
            Object.assign(req.user, userData.dataValues); 
            next();
        }
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({"status":"error","message":"Invalid access token"});
    }

    
};

module.exports = { adminAuth };