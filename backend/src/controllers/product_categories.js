const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')

module.exports = {
    get: async (req, res) => {
        try{
            const data = await model.product_categories.findOne({
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

    create: async (req, res) => {
        try{
            const data = await model.product_categories.create({
                name: req.body.name,
                created_by: req.userData.id
            })

            return res.status(200).send(data)
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    }, 

    list: async (req, res) => {
        const {from, to, page, limit} = req.query
        const {queryLimit, queryOffset} = helper.limitOffset(page, limit)
        
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
            const data = await model.sequelize.query(`select a.*, b.full_name as creator_name, b.email as creator_email from product_categories a left join users b on a.created_by = b.id ${where.length > 0 ? where : ''} limit ${queryOffset}, ${queryLimit}`, 
            {
                nest: true
            });

            const totalData = await model.sequelize.query(`select COUNT(a.id) as total_rows from product_categories a ${where.length > 0 ? where : ''}`, 
            {
                nest: true
            });

            const result = helper.pageData(totalData[0].total_rows, page, limit)

            return res.status(data ? 200 : 404).send({...result, data: data})
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    },

    edit: async (req, res) => {
        const body = req.body

        try{
            const allowedToEdit = [
                'name'
            ];
            
            (Object.keys(body)).map(v => {
                if(!allowedToEdit.includes(v)){
                    delete body[v];
                }
            })

            await model.product_categories.update(body, {
                where: {
                    id: req.params.id
                }
            })

            const updatedData = await model.product_categories.findOne({
                where: {
                    id: req.params.id
                },
                include: {
                    model: model.user.scope('ownership'),
                    as: 'creator_details'
                }
            })

            return res.status(200).send(updatedData)
        }catch(err){
            console.error(err)
            return helper.errorResponse(res)
        }
    }
}