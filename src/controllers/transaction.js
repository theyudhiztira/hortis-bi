const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')
const moment = require('moment')

module.exports = {
    create: async (req, res) => {
        let productIds = [];

        (req.body.cart).map(v => {
            return !productIds.includes(v.product_id) ? productIds = [...productIds, v.product_id] : false
        })

        const pricing = await local.fetchPrice(productIds)
        const recordTransaction = await local.recordTransaction(pricing, req.body.cart, req.body.customer_id, req.userData.id)

        return res.status(200).send(recordTransaction)
    },

    get: async (req, res) => {
        try{
            const data = await model.transactions.findOne({
                where: {
                    id: req.params.id
                },
                hide: ['created_by'],
                include: [{
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                },{
                    model: model.transaction_items,
                    as: 'items',
                    include: {
                        model: model.product_entries,
                        as: 'product_details',
                        attributes: ['name']
                    }
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
        let where = {};
        if(req.query.from || req.query.to){
            if(req.query.from && req.query.to){
                where = {...where, created_at: {
                    [Op.between]: [req.query.from, req.query.to]
                }}
            }else if(req.query.from && !req.query.to){
                where = {...where, created_at: {
                    [Op.gte]: req.query.from
                }}
            }else{
                where = {...where, created_at: {
                    [Op.lte]: req.query.to
                }}
            }
        }

        console.log(where, req.params)

        try{
            const data = await model.transactions.findAll({
                where: where,
                hide: ['created_by'],
                include: [{
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                },{
                    model: model.transaction_items,
                    as: 'items',
                    include: {
                        model: model.product_entries,
                        as: 'product_details',
                        attributes: ['name']
                    }
                }]
            });

            return res.status(data ? 200 : 404).send(data ? data : {
                message: "Data not found!"
            })
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    }
}

const local = exports = {
    /**
     * 
     * @param {array} productIds Pool of product ids
     * @returns {object}
     */
    fetchPrice: async (productIds) => {
        const data = await model.product_entries.findAll({
            where: {
                id: {
                    [Op.in]: productIds
                }
            }
        })

        let result = {};

        (data).map(dt => {
            result[dt.id] = {
                name: dt.name,
                retail_price: dt.price_per_unit_retail
            }
        })

        return result
    },

    recordTransaction: async (pricing, cart, customerId, userId) => {
        let amountDue = 0

        cart.map(item => {
            amountDue += pricing[item.product_id].retail_price * item.quantity
        })
        
        const headerData = {
            customer_id: customerId,
            amount_due: amountDue,
            created_by: userId
        }
        
        const headerRecord = await model.transactions.create(headerData);
        let bodyRecord = [];
        
        console.log(bodyRecord)
        const items = cart.map(async item => {
            newBodyData = await model.transaction_items.create({
                transaction_id: headerRecord.id,
                product: item.product_id,
                price: pricing[item.product_id].retail_price,
                quantity: item.quantity,
                created_by: userId
            })

            newBodyData = await {...JSON.parse(JSON.stringify(newBodyData)), product_name: pricing[item.product_id].name}
            return newBodyData;
        })

        const result = {...JSON.parse(JSON.stringify(headerRecord)), items: await Promise.all(items)}

        return result
    }
}

