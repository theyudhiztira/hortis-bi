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

            if(periods[newPeriod][mode === 'category' ? val.category_name : val.name] > 0){
              periods[newPeriod][mode === 'category' ? val.category_name : val.name] += type === 'income' ? (val.quantity * val.price) : val.quantity
            }else{
              periods[newPeriod] = {...periods[newPeriod], [mode === 'category' ? val.category_name : val.name]: type === 'income' ? (val.quantity * val.price) : val.quantity}
            }
        })

        let dataSets = {}
        let dataResult = []
        const categories = mode === 'category' ? await local.getCategories() : await local.getProducts() 

        categories.map(v => {
            dataSets = {...dataSets, [v.name]: []}
        })

        Object.keys(dataSets).map(v => {
            Object.keys(periods).map(pos => {
                dataSets[v] = [...dataSets[v], periods[pos][v] > 0 ? periods[pos][v] : 0]
            })
        })
        
        const monthlyPieChart = periods[moment().format('YYYY-MM')] ? await local.parseMonthlyPieChart(periods[moment().format('YYYY-MM')]) : {}
        const annualPieChart = await local.parseAnnualPieChart(dataSets)
        // const incomeSummary = await local.parseIncomeSummary(dataSets)

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
          lineChart: {
            labels: Object.keys(periods),
            datasets: dataResult
          },
          annualPieChart: annualPieChart,
          monthlyPieChart: monthlyPieChart
        })
    }
}

const local = exports = {
  parseAnnualIncomeSummary: async (params) => {
    let data = 0

    Object.values(params).map((dataValue, dataIndex) => {
      data += dataValue.reduce((firstValue, secondValue) => firstValue + secondValue, 0)
    })

    return data
  },

  parseMonthlyPieChart: async (params) => {
    const result = {
      labels: Object.keys(params),
      datasets: [{}]
    }

    let data = []
    let backgroundColors = []
    let borderColors = []

    result.labels.map(() => {
      data = [...data, 0]
      const color = randomColor({
          luminosity: 'dark',
          format: 'rgba',
          alpha: 0.6
      });

      backgroundColors = [...backgroundColors, color]
      borderColors = [...borderColors, color]
    })

    result.datasets[0] = {...result.datasets[0], backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1, data: Object.values(params)}

    return result
  },

  parseAnnualPieChart: async (params) => {
    const result = {
      labels: Object.keys(params),
      datasets: [{}]
    }

    let data = []
    let backgroundColors = []
    let borderColors = []

    result.labels.map(() => {
      data = [...data, 0]
      const color = randomColor({
          luminosity: 'bright',
          format: 'rgba',
          alpha: 0.7
      });

      backgroundColors = [...backgroundColors, color]
      borderColors = [...borderColors, color]
    })

    Object.values(params).map((dataValue, dataIndex) => {
      data[dataIndex] = dataValue.reduce((firstValue, secondValue) => firstValue + secondValue, 0)
    })

    result.datasets[0] = {...result.datasets[0], backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1, data: data}
    
    return result
  },
  
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

  getProducts: async () => {
    const result = await sequelize.query('SELECT * FROM `product_entries`', {nest:true})

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