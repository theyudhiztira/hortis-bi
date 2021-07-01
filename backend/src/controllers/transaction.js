const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')
const moment = require('moment')
const { db, sequelize } = require('../models')

module.exports = {
  create: async (req, res) => {
    const transactionHt = {
      amount_due: req.body.cart.map(cart => {
        const subTotal = cart.price * cart.qty
        return +subTotal
      }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
      date: req.body.date,
      created_by: req.userData.id
    }
    
    let transactionHtId = {};
    try {
      transactionHtId = await model.transactions.create(transactionHt)
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: 'Failed when saving the tranaction header!'
      })
    }

    await Promise.all(req.body.cart.map( async cart => {
      const transactionDt = {
        transaction_id: transactionHtId.id,
        product: cart.details.id,
        price: cart.price,
        pricing_type: cart.priceGroup,
        quantity: cart.qty,
        created_by: req.userData.id
      }
      
      try {
        await model.transaction_items.create(transactionDt)
      } catch (error) {
        await model.transactions.destroy({
          where: {
            id: transactionHtId.id
          }
        })
        return res.status(500).send({
          status: false,
          message: 'Failed when saving the tranaction details!'
        })
      }
    }));

    return res.status(200).send({
      status: true
    })
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
        const {from, to, page, limit, date} = req.query
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

        if(date){
          where += `and a.created_at like '${date}%'`
        }


        try{
        //     const data = await sequelize.query(`select a.*, b.full_name from transactions a 
        //     left join users b on a.created_by = b.id ${where.length > 0 ? where : ''} limit ${queryOffset}, ${queryLimit}`, 
        //     {
        //         nest: true
        //     });

        //     const totalData = await sequelize.query(`select COUNT(a.id) as total_rows from transactions a ${where.length > 0 ? 'where '+where.replace('and ', '') : ''}`, 
        //     {
        //         nest: true
        //     });

        //     const result = local.pageData(totalData[0].total_rows, page, limit)

        //     return res.status(data ? 200 : 404).send({...result, data: data})
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

