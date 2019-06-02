const jwt = require('jsonwebtoken');
const httpStatusCode= require('http-status-codes');

const dbConfig = require('../config/secret');

module.exports = {
    VerifyToken: (req,res, next) => {

        if(!req.headers.authorization){
            return res.status(httpStatusCode.UNAUTHORIZED).json({message: 'No authorization'});
        }
        
        const token = req.cookies.auth || req.headers.authorization.split(' ')[1];

       
        // console.log(token);
        // console.log(req.headers);

        
        if(!token){
            return res.status(httpStatusCode.FORBIDDEN).json({message: 'No Token Provided'});
        }

        return jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if(err){
                if(err.expiredAt < new Date()){
                    return  res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({message: 'Token has expired. please login again!', token: null});
                }
                next ();
            }
            req.user = decoded.data; 
            next ();
        });
    }
};