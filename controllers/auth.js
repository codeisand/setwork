const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/userModels');
const Helper = require('../Helpers/helpers');
const dbConfig = require('../config/secret');
module.exports = {
    async CreateUser(req, res) {
        console.log(req.body);
        const schema = Joi.object().keys({
            username: Joi.string().min(5).max(20).required(),
            password: Joi.string().min(5).required(),
            email: Joi.string().email().required()
        });

        const {
            error,
            value
        } = Joi.validate(req.body, schema);
        console.log(value);
        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                msg: error.details
            });
        }

        const userEmail = await User.findOne({
            email: Helper.lowerCase(req.body.email)
        });
        if (userEmail) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'Email already exist'
            });
        }

        const userName = await User.findOne({
            username: Helper.firstUpper(req.body.username)
        });
        if (userName) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'Username already exist'
            });
        }

        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error hashing Password'
                });
            }
            const body = {
                username: Helper.firstUpper(value.username),
                email: Helper.lowerCase(value.email),
                password: hash
            };


            User.create(body).then((user) => {
                const token = jwt.sign({
                    data: user
                }, dbConfig.secret, {
                    expiresIn: '5h'
                });
                res.cookie('auth', token);
                res.json({
                    message: 'User created successfully',
                    user,
                    token
                });
            }).catch((err) => {
                res.json({
                    message: 'Error Occured'
                });
            });
        });
    },



    async LoginUser(req, res) {
       
        if (!req.body.username || !req.body.password) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'No empty fields allowes'
            });
        }

        await User.findOne({
            username: Helper.firstUpper(req.body.username)
        }).then((user) => {
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Username not found'
                });
            }

            return bcrypt.compare(req.body.password, user.password).then((result)=> {
                if(!result){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        message: 'Password is incorrect'
                    });
                }

                const token = jwt.sign({data: user}, dbConfig.secret, {
                    expiresIn: '5h'
                });
                res.cookie('auth', token);
                return res.status(HttpStatus.OK).json({message: 'Login Successful', user, token})
            })
        }).catch((err) => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error occured'
            });
        })
    }
};