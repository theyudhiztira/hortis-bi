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
      let where = ''

      if(req.query.terms){
        where+=`where name like "%${req.query.terms}%"`
      }

      try{
          const data = await model.sequelize.query(`select * from product_categories ${where}`, 
          {
              nest: true
          });

          return res.status(data ? 200 : 404).send({data: data})
      }catch(err){
          console.error(err)
          return helper.errorResponse(res)
      }
    },

    subCatList: async (req, res) => {
      let where = ''

      if(req.query.terms){
        where+=`where name like "%${req.query.terms}%"`
      }

      try{
          const data = await model.sequelize.query(`select * from product_sub_categories ${where}`, 
          {
              nest: true
          });

          return res.status(data ? 200 : 404).send({data: data})
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