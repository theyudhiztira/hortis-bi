const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')
const moment = require('moment')
const { db, sequelize } = require('../models')

module.exports = {
  delete: async (req, res) => {
    const trxId = req.params.id

    try{
      await model.productions.destroy({
        where: {
          id: trxId
        }
      })

      await model.production_details.destroy({
        where: {
          production_id: trxId
        }
      })
    }catch(err){
      return res.status(500).send({
        status: false,
        message: 'Error when running the query!'
      })
    }

    return res.status(200).send({
      status: true,
      message: `Production ID : ${trxId} removed ok`
    })
  },
  
  create: async (req, res) => {
    const productionHt = {
      supplier: req.body.supplier,
      date: req.body.date,
      created_by: req.userData.id
    }
    
    let productionHtId = {};
      console.log(productionHt)

    try {
      productionHtId = await model.productions.create(productionHt)
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        status: false,
        message: 'Failed when saving the tranaction header!'
      })
    }

    await Promise.all(req.body.cart.map( async cart => {
      const productionDt = {
        production_id: productionHtId.id,
        product: cart.details.id,
        quantity: cart.qty,
        unit: cart.details.unit,
        created_by: req.userData.id
      }
      
      try {
        await model.production_details.create(productionDt)
      } catch (error) {
        await model.productions.destroy({
          where: {
            id: productionHtId.id
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
            const data = await model.productions.findOne({
                where: {
                    id: req.params.id
                },
                hide: ['created_by'],
                include: [{
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                },{
                    model: model.production_details,
                    as: 'items',
                    include: {
                        model: model.product_entries,
                        as: 'product_details',
                        attributes: ['name'],
                        required: true
                    }
                },{
                  model: model.customer,
                  as: 'supplier_details'
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
            const data = await sequelize.query(`select a.*, b.full_name, c.full_name as supplier_name from production a 
            left join users b on a.created_by = b.id
            left join customers c on a.supplier = c.id
            ${where.length > 0 ? where : ''}`, 
            {
                nest: true
            });

            return res.status(data ? 200 : 404).send({data: data})
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
        
        const headerRecord = await model.productions.create(headerData);
        let bodyRecord = [];
        
        console.log(bodyRecord)
        const items = cart.map(async item => {
            newBodyData = await model.production_details.create({
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

