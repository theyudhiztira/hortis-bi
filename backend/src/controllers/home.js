const model = require('../models')
const helper = require('../helpers/helpers')
const { Op, Sequelize } = require('sequelize')
const { db, sequelize } = require('../models')


module.exports = {
  home: async (req, res) => {
    try{
        const product = await model.product_entries.findAll({
            include: [{
                model: model.user.scope('ownership'),
                as: 'creator_details'
            }, {
                model: model.product_categories.scope('categoryDetails'),
                as: 'category_details'
            }, {
              model: model.product_sub_categories.scope('subCategoryDetails'),
              as: 'sub_category_details'
            }]
        });

        const transaction = await sequelize.query(`select a.*, b.full_name from transactions a 
        left join users b on a.created_by = b.id `, 
        {
            nest: true
        });

        const production = await sequelize.query(`select a.*, b.full_name, c.full_name as supplier_name from production a 
        left join users b on a.created_by = b.id
        left join customers c on a.supplier = c.id`, 
        {
            nest: true
        });

        return res.status(200).send({
          product: product.length,
          transaction: transaction.length,
          production: production.length
        })
    }catch(err){
        console.error(err)
        return helper.errorResponse(res)
    }
  }
}