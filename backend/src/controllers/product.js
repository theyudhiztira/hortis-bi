const model = require('../models')
const { db, sequelize } = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')

module.exports = {
    create: async (req, res) => {
        try{
            const data = await model.product_entries.create({
                name: req.body.name,
                category_id: req.body.category_id,
                sub_category_id: req.body.sub_category_id,
                name: req.body.name,
                unit: req.body.unit,
                reseller1_price: req.body.reseller1_price,
                reseller2_price: req.body.reseller2_price,
                reseller3_price: req.body.reseller3_price,
                stock: 0,
                created_by: req.userData.id
            })

            return res.status(200).send(data)
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    },

    get: async (req, res) => {
        try{
            const data = await sequelize.query(`select a.*, b.name as sub_category, c.name as category from product_entries a 
            left join product_sub_categories b on a.sub_category_id = b.id
            left join product_categories c on a.category_id = c.id
            where a.id = ${req.params.id}
            `, 
            {
                nest: true
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
            const data = await model.product_entries.findAll({
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
                'category_id', 'sub_category_id', 'name', 'unit', 'retail_price', 'reseller1_price', 'reseller2_price', 'reseller3_price', 'stock', 'is_unlimited'
            ];
            
            (Object.keys(body)).map(v => {
                if(!allowedToEdit.includes(v)){
                    delete body[v];
                }
            })

            await model.product_entries.update(body, {
                where: {
                    id: req.params.id
                }
            })

            const updatedData = await model.product_entries.findOne({
                where: {
                    id: req.params.id
                },
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
            })

            return res.status(200).send(updatedData)
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    },
}