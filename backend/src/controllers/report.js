const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')
const moment = require('moment')
const { db, sequelize } = require('../models')
const randomColor = require('randomcolor')

module.exports = {
    chartReports: async (req, res) => {
        const {type, year, mode} = req.query

        const getData = await local.fetchData(year)
        const periods = await local.getPeriod(year)

        getData.map(val => {
            const splittedPeriod = val.date.split("-")
            const newPeriod = `${splittedPeriod[0]}-${splittedPeriod[1]}`;

            periods[newPeriod] = {...periods[newPeriod], [val.category_name]: val.quantity}
        })

        let dataSets = {}
        let dataResult = []
        const categories = await local.getCategories()

        categories.map(v => {
            dataSets = {...dataSets, [v.name]: []}
        })

        Object.keys(dataSets).map(v => {
            Object.keys(periods).map(pos => {
                dataSets[v] = [...dataSets[v], periods[pos][v]]
            })
        })

        Object.keys(dataSets).map(x => {
          const color = randomColor({
              luminosity: 'bright',
              format: 'rgba',
              alpha: 0.4
          });

            dataResult = [...dataResult, {
                label: `${x}`,
                data: Object.values(dataSets[x]),
                fill: true,
                tension: 0.2,
                borderColor: color,
                backgroundColor: color
            }]
        })


        return res.status(200).send({
            labels: Object.keys(periods),
            datasets: dataResult
        })
    }
}

const local = exports = {
    fetchData: async (year) => {
        const getData = await sequelize.query(
            `SELECT a.*, b.date, c.name, c.unit, d.name as category_name FROM transaction_items a 
            LEFT JOIN transactions b ON a.transaction_id = b.id
            LEFT JOIN product_entries c ON a.product = c.id
            LEFT JOIN product_categories d ON c.category_id = d.id
            WHERE b.date LIKE '${year ? year : moment().format('YYYY')}%'`,
            {
                nest: true
            }
        )

        return getData
    },

    getCategories: async () => {
        const result = await sequelize.query('SELECT * FROM product_categories', {nest:true})

        return result
    },

    getPeriod: async (year) => {
        const categories = await local.getCategories()
        let categoriesResult = {}
        categories.map(cat => {
            categoriesResult = {...categoriesResult, [cat.name]: 0}
        })

        let periods = {}
        for (let i = 1; i <= 12; i++) {
            periods = {...periods, [`${year ? year : moment().format('YYYY')}-${('0' + i).slice(-2)}`]: categoriesResult}
        }

        return periods
    },

    removeDuplicate: (array) => {
        const newArray = new Set(array)
        const arrayResult = [...newArray]

        return arrayResult
    }
}