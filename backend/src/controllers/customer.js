const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')

module.exports = {
    create: async (req, res) => {
        try{
            const data = await model.customer.create({
                full_name: req.body.full_name,
                phone: req.body.phone,
                email: req.body.email,
                created_by: req.userData.id
            })

            return res.status(200).send(data)
        }catch(err){
            console.log(err.original.sqlMessage)
            if(err.original.code === 'ER_DUP_ENTRY'){
                return helper.errorResponse(res, 'Customer\'s email has been taken by another customer', 422)
            }
            return helper.errorResponse(res)
        }
    },

    get: async (req, res) => {
        try{
            const data = await model.customer.findOne({
                where: {
                    id: req.params.id
                },
                hide: ['created_by'],
                include: [{
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                }]
            });

            return res.status(data ? 200 : 404).send(data ? data : {
                message: "Data not found!"
            })
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    },

    list: async (req, res) => {
        try{
            const data = await model.customer.findAll({
                include: [{
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                }]
            });

            return res.status(data ? 200 : 404).send(data ? data : {
                message: "Data not found!"
            })
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    },

    edit: async (req, res) => {
        const body = req.body

        try{
            const allowedToEdit = [
                'full_name', 'phone', 'email'
            ];
            
            (Object.keys(body)).map(v => {
                if(!allowedToEdit.includes(v)){
                    delete body[v];
                }
            })

            await model.customer.update(body, {
                where: {
                    id: req.params.id
                }
            })

            const updatedData = await model.customer.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                }]
            })

            return res.status(200).send(updatedData)
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    },
}