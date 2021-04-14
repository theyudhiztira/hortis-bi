const model = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const moment = require('moment');

exports.login = async (req, res) => {
    let body = req.body;
    
    console.log(body)

    const findAgent = await model.user
    .findOne({
        where: {
            email: body.email
        },
        attributes: [
            'id',
            'email',
            'phone',
            'password',
            'full_name',
            'role',
            'created_at'
        ],
        raw: true
    });

    if (!findAgent) {
        return res.status(401).send({
            message: 'Please check your credentials!'
        });
    }

    bcrypt.compare(body.password, findAgent.password, async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send({
                message: error
            });
        }

        if (result) {
            let encodedToken = jwt.sign({
                id: findAgent.id,
                email: findAgent.email,
                role: findAgent.role,
                full_name: findAgent.full_name
            }, process.env.JWT_KEY, {
                expiresIn: "24h"
            });

            delete findAgent.password;

            return res.status(200).send({
                token: encodedToken,
                data: findAgent
            });
        } else {
            return res.status(403).send({
                message: 'Auth Failed'
            });
        }
    });
};

exports.register = async (req, res) => {
    
}

exports.verifyToken = (req, res) => {
    try {
        jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
        return res.status(200).send({
            status: true
        });
    } catch (error) {
        return res.status(403).send({
            status: false
        });
    }
};