const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')
const moment = require('moment')
const { db, sequelize } = require('../models')

module.exports = {
    create: async (req, res) => {
        let productIds = [];

        (req.body.cart).map(v => {
            return !productIds.includes(v.product_id) ? productIds = [...productIds, v.product_id] : false
        })

        const pricing = await local.fetchPrice(productIds)
        const recordTransaction = await local.recordTransaction(pricing, req.body.cart, req.body.customer_id, req.userData.id, req.body.date)

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
                },{
                    model: model.customer,
                    as: 'customer_details'
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
        const {from, to, page, limit} = req.query
        const {queryLimit, queryOffset} = local.limitOffset(page, limit)
        
        let where = "";
        if(from || to){
            if(from && to){
                where += `where a.created_at between '${from}' and '${to}'`
            }else if(from && !to){
                where += `where a.created_at >= '${from}'`
            }else{
                where += `where a.created_at <= '${to}'`
            }
        }


        try{
            const data = await sequelize.query(`select a.id, a.customer_id, a.amount_due, a.date, b.full_name, b.phone, b.email, a.created_by, a.created_at from transactions a left join customers b on a.customer_id = b.id ${where.length > 0 ? where : ''} limit ${queryOffset}, ${queryLimit}`, 
            {
                nest: true
            });

            const totalData = await sequelize.query(`select COUNT(a.id) as total_rows from transactions a ${where.length > 0 ? where : ''}`, 
            {
                nest: true
            });

            const result = local.pageData(totalData[0].total_rows, page, limit)

            return res.status(data ? 200 : 404).send({...result, data: data})
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

    recordTransaction: async (pricing, cart, customerId, userId, date) => {
        let amountDue = 0

        cart.map(item => {
            amountDue += pricing[item.product_id].retail_price * item.quantity
        })
        
        const headerData = {
            customer_id: customerId,
            amount_due: amountDue,
            created_by: userId,
            date: date
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
    },

    limitOffset: (page, limit) => {
        const queryLimit = limit ? parseInt(limit) : 3
        const queryOffset = page ? (page-1) * limit : 0

        return {queryLimit, queryOffset}
    },

    pageData: (totalData, page, limit) => {
        const currentPage = page ? parseInt(page) : 1
        const totalPages = Math.ceil(totalData / limit); 

        return {currentPage, totalPages}
    }
}

