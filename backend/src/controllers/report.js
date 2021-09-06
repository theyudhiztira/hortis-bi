const model = require('../models')
const { Op, Sequelize } = require('sequelize')
const helper = require('../helpers/helpers')
const moment = require('moment')
const { db, sequelize } = require('../models')
const randomColor = require('randomcolor')
const numeral = require('numeral')
const pdfMake = require('pdfmake/build/pdfmake')
const pdfFonts = require('pdfmake/build/vfs_fonts')

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  'Roboto': {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-Italic.ttf'
  }
};

const parseLineChart = (data) => {
  let newObject = data.map(data => {
    let parsedInt = {}
    Object.keys(data).map(dataKey => {
      if(dataKey !== 'periode'){
        return parsedInt = {...parsedInt, [dataKey]: parseFloat(data[dataKey])}
      }

      return parsedInt = {...parsedInt, periode: data.periode}
    })
    
    return parsedInt
  })

  newObject = newObject.sort((a, b) => (a.periode > b.periode) ? 1 : -1)

  const categories = Object.keys(newObject[1]).filter(keyValue => keyValue !== 'periode').map(keyValue => {
    return keyValue
  })

  const result = {
      labels: newObject.map(value => {
        return value.periode
      }),
      datasets: categories.map(categoryValue => {
        const luminosity = ['bright', 'dark']
        const color = randomColor({
          luminosity: luminosity[Math.floor(Math.random() * luminosity.length)],
          format: 'rgba',
          alpha: 0.5
        })

        return {
          label: categoryValue,
          data: newObject.map(value => value[categoryValue]),
          backgroundColor: color,
          borderColor: color
        }
      })
    }

  return result
}

const parsePieChart = (data) => {
  let newObject = data.map(data => {
    let parsedInt = {}
    Object.keys(data).map(dataKey => {
      if(dataKey !== 'periode'){
        return parsedInt = {...parsedInt, [dataKey]: parseFloat(data[dataKey])}
      }

      return parsedInt = {...parsedInt, periode: data.periode}
    })
    
    return parsedInt
  })

  newObject = newObject.sort((a, b) => (a.periode > b.periode) ? 1 : -1)

  const categories = Object.keys(newObject[1]).filter(keyValue => keyValue !== 'periode').map(keyValue => {
    return keyValue
  })

  const luminosity = ['bright', 'dark']
  let color = categories.map(() => {
    return randomColor({
      luminosity: luminosity[Math.floor(Math.random() * luminosity.length)],
      format: 'rgba',
      alpha: 0.5
    })
  })
  
  const finalData = categories.map(categoryValue => {
    let totalData = 0
    newObject.filter(value => value.category_name !== categoryValue).map(value => {
      return totalData+=value[categoryValue]
    })

    return totalData
  })
  
  const overAllData = finalData.reduce((a, b) => a + b, 0)
  const percentage = finalData.map(value => {
    return (parseFloat(value) / parseFloat(overAllData)) * 100
  })

  const result = {
    labels: categories.map((v, i) => {
      return `${v} - (${numeral(percentage[i]).format('0,0.[00]')}%)`
    }),
    datasets: [
      {
        // label: '',
        data: finalData,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
    percentage: ''
  }

  return result
}

module.exports = {
  downloadPDFReport: async (req, res) => {
    const {year} = req.query

    const getData = await local.fetchData(year)
    const periods = await local.getPeriod(year)
    const categories = await local.getCategories(year)
    const products = await local.getProducts(year)

    let rawResult = {}

    console.time('parsingOperation')
    Object.keys(periods).map(period => {
      rawResult = {...rawResult, [period]: categories.map(category => {
          return {
            [category.name]: products.filter(product => {
              return category.id === product.category_id
            }).map(product => {
              return {
                [product.name]: {
                  quantity: getData.filter(data => {
                    return moment(data.date).format('YYYY-MM') === period
                  }).filter(data => {
                    return data.category_name === category.name
                  }).filter(data => {
                    return data.name === product.name
                  }).map(data => {
                    return +data.quantity
                  }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
                  income: getData.filter(data => {
                    return moment(data.date).format('YYYY-MM') === period
                  }).filter(data => {
                    return data.category_name === category.name
                  }).filter(data => {
                    return data.name === product.name
                  }).map(data => {
                    return +data.quantity * data.price
                  }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
                }
              }
            })
          }
        })
      }
    })
    console.timeEnd('parsingOperation')
    
    let raw = {}

    Object.keys(periods).map(data  => {
      raw = {...raw, }
    })

    let tableContent = []
    let incomeTotal = 0
    let quantityTotal = 0

    Object.keys(rawResult).map((firstLayerData, index) => {
      tableContent = [...tableContent, [{text: firstLayerData, style: 'tableHeader', colSpan: 3, alignment: 'center', fillColor: '#62cb31'}, {}, {}]]
        return categories.map((category, key) => {
          let incomeSubTotal = 0
          let quantitySubTotal = 0

          tableContent = [
            ...tableContent, 
            [{text: category.name, style: 'tableHeader', colSpan: 3, alignment: 'left', fillColor: '#EEEE00'}, {}, {}],
          ]
          
          if((rawResult[firstLayerData][key][category.name]).length > 0){
            Object.values(rawResult[firstLayerData][key][category.name]).map(product => {
              const detail = Object.values(product)[0]
              incomeSubTotal+=detail.income
              quantitySubTotal+=detail.quantity
              
              return tableContent = [
                ...tableContent, 
                [{text: Object.keys(product)[0], alignment: 'left'}, {text: numeral(detail.quantity).format('0,0.[0000]'), alignment: 'right'}, {text: numeral(detail.income).format('0,0.[0000]'), alignment: 'right'}],
              ]
            })
          }else{
            tableContent = [
                ...tableContent, 
                [{text: 'No Data Available', style: 'tableHeader', colSpan: 3, alignment: 'center'}, {}, {}],
              ]
          }

          incomeTotal+=incomeSubTotal
          quantityTotal+=quantitySubTotal

          return tableContent = [
            ...tableContent, 
            [{text: 'Subtotal', style: 'tableHeader', alignment: 'right', fillColor: '#55fbf3'}, {text: numeral(quantitySubTotal).format('0,0.[0000]'), style: 'tableHeader', alignment: 'right', fillColor: '#55fbf3'}, {text: numeral(incomeSubTotal).format('0,0.[0000]'), style: 'tableHeader', alignment: 'right', fillColor: '#55fbf3'}],
          ]
        })
    })

    tableContent = [...tableContent, 
      [{text: `Grand Total of ${year}`, style: 'tableHeader', alignment: 'right', fillColor: '#f09012'}, {text: numeral(quantityTotal).format('0,0.[0000]'), style: 'tableHeader', alignment: 'right', fillColor: '#f09012'}, {text: numeral(incomeTotal).format('0,0.[0000]'), style: 'tableHeader', alignment: 'right', fillColor: '#f09012'}],
    ]

    const pdfContent = {
      content: [
        {text: `Transaction Report of ${year}`, style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', '*', '*'],
            body: tableContent
          }
        },
        {text: `Generated on : ${moment().format('YYYY-MM-DD HH:mm:ss')}`},
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    }

    const pdfFile = pdfMake.createPdf(pdfContent)
    return pdfFile.getBase64(encodedPDF => {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename="Hortifarm BI ${year} Report ${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf"`
      })

      const download = Buffer.from(encodedPDF.toString('utf-8'), 'base64')
      return res.end(download)
    })
  },

  tableData: async (req, res) => {
    const { year } = req.query

    const data = await local.fetchData(year)
    const categories = (await local.getCategories(year)).map(category => {
      return category.name
    })
    const periods = Object.keys(await local.getPeriod(year))
    const products = await local.getProducts(year)

    let resultByCategory = {}
    let resultByItem = {}

    periods.map(period => {
      resultByCategory = {...resultByCategory, [period]: categories.map(category => {
          return {[category]: {
            quantity: data.filter(value => {
              return value.category_name === category
            }).filter(value => {
              return moment(value.date).format('YYYY-MM') === period
            }).map(value => {
              return +value.quantity
            }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
            income: data.filter(value => {
              return value.category_name === category
            }).filter(value => {
              return moment(value.date).format('YYYY-MM') === period
            }).map(value => {
              return +value.quantity * value.price
            }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
          }}
        })
      }

      resultByItem = {...resultByItem, [period]: products.map(product => {
          return {[product.name]: {
            unit: product.unit,
            quantity: data.filter(value => {
              return value.name === product.name
            }).filter(value => {
              return moment(value.date).format('YYYY-MM') === period
            }).map(value => {
              return +value.quantity
            }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
            income: data.filter(value => {
              return value.name === product.name
            }).filter(value => {
              return moment(value.date).format('YYYY-MM') === period
            }).map(value => {
              return +value.quantity * value.price
            }).reduce((firstValue, secondValue) => firstValue + secondValue, 0),
          }}
        })
      }
    })

    return res.status(200).send({
      byCategory: resultByCategory,
      byItem: resultByItem
    })
  },

  firstLineChart: async (req, res) => {
    const where = ''
    let {type, year, mode} = req.query
    let sumCase = []
    let allPeriod = []
    let category = []
    let data = []

    for (let index = 1; index <= 12; index++) {
      allPeriod = [...allPeriod, `${year ? year : moment().format('YYYY')}-${('0' + index).slice(-2)}`]
    }

    try {
      let getCategories = [];

      switch (mode) {
        case 'product_sub_categories':
          getCategories = await local.getSubCategory(type)
          mode = 'e'
          break;
        case 'product_entries':
          getCategories = await local.getProductEntries(type)
          mode = 'c'
          break;
        default:
          getCategories = await local.getCategories()
          mode = 'd'
          break;
      }

      category = getCategories.map(category => {
        sumCase = [...sumCase, `SUM(CASE 
        WHEN ${mode}.name = '${category.name}'
            THEN a.quantity * a.price 
            ELSE 0 
        END) AS '${category.name}'`]
        return category.name
      })
      
      data = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date like '${year ? year : moment().format('YYYY')}%'
      group by periode
      ${where}`, {nest:true})
    } catch (error) {
      console.log(error)
    }

    allPeriod.forEach(period => {
      const findData = Object.values(data).find(item => item.periode === period)
      let emptyData = {periode: period, ...category.reduce((acc,curr) => (acc[curr] = 0,acc),{})}

      if(!findData){
        data = [...data, emptyData]
      }
    })

    const finalData = parseLineChart(Object.values(data))

    return res.status(200).send(finalData)
  },

  getDailyChart: async (req, res) => {
    const where = ''
    let {type, year, mode} = req.query
    let sumCase = []
    let allPeriod = []
    let category = []
    let data = []

    if(year){
      year+='-'+moment().format('MM')
    }

    for (let index = 1; index <= moment().daysInMonth(); index++) {
      allPeriod = [...allPeriod, `${year ? year : moment().format('YYYY-MM')}-${('0' + index).slice(-2)}`]
    }

    try {
      let getCategories = [];

      switch (mode) {
        case 'product_sub_categories':
          getCategories = await local.getSubCategory(type)
          mode = 'e'
          break;
        case 'product_entries':
          getCategories = await local.getProductEntries(type)
          mode = 'c'
          break;
        default:
          getCategories = await local.getCategories()
          mode = 'd'
          break;
      }

      category = getCategories.map(category => {
        sumCase = [...sumCase, `SUM(CASE 
        WHEN ${mode}.name = '${category.name}'
            THEN a.quantity * a.price 
            ELSE 0 
        END) AS '${category.name}'`]
        return category.name
      })
      
      data = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m-%d') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date like '${year ? year : moment().format('YYYY-MM')}%'
      group by periode
      ${where}`, {nest:true})
    } catch (error) {
      console.log(error)
    }

    allPeriod.forEach(period => {
      const findData = Object.values(data).find(item => item.periode === period)
      let emptyData = {periode: period, ...category.reduce((acc,curr) => (acc[curr] = 0,acc),{})}

      if(!findData){
        data = [...data, emptyData]
      }
    })

    const finalData = parseLineChart(Object.values(data))

    return res.status(200).send(finalData)
  },

  firstPieChart: async (req, res) => {
    const where = ''
    let {type, year, mode} = req.query
    let sumCase = []
    let allPeriod = []
    let category = []
    let data = []

    for (let index = 1; index <= 12; index++) {
      allPeriod = [...allPeriod, `${year ? year : moment().format('YYYY')}-${('0' + index).slice(-2)}`]
    }

    try {
      let getCategories = [];

      switch (mode) {
        case 'product_sub_categories':
          getCategories = await local.getSubCategory(type)
          mode = 'e'
          break;
        case 'product_entries':
          getCategories = await local.getProductEntries(type)
          mode = 'c'
          break;
        default:
          getCategories = await local.getCategories()
          mode = 'd'
          break;
      }

      category = getCategories.map(category => {
        sumCase = [...sumCase, `SUM(CASE 
        WHEN ${mode}.name = '${category.name}'
            THEN a.quantity * a.price 
            ELSE 0 
        END) AS '${category.name}'`]
        return category.name
      })
      
      data = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date like '${year ? year : moment().format('YYYY')}%'
      group by periode
      ${where}`, {nest:true})
    } catch (error) {
      console.log(error)
    }

    allPeriod.forEach(period => {
      const findData = Object.values(data).find(item => item.periode === period)
      let emptyData = {periode: period, ...category.reduce((acc,curr) => (acc[curr] = 0,acc),{})}

      if(!findData){
        data = [...data, emptyData]
      }
    })

    const finalData = parsePieChart(Object.values(data))

    return res.status(200).send(finalData)
  },

  firstTextReport: async (req, res) => {
    const where = ''
    let {type, year, mode} = req.query
    let sumCase = []
    let allPeriod = []
    let category = []
    let hiData = []
    let sdhiData = []
    let sdbiData = []

    for (let index = 1; index <= 12; index++) {
      allPeriod = [...allPeriod, `${year ? year : moment().format('YYYY')}-${('0' + index).slice(-2)}`]
    }

    try {
      let getCategories = []
      let queryMode = 'xxx'

      switch (mode) {
        case 'product_sub_categories':
          getCategories = await local.getSubCategory(type)
          queryMode = 'e'
          break;
        case 'product_entries':
          getCategories = await local.getProductEntries(type)
          queryMode = 'c'
          break;
        default:
          getCategories = await local.getCategories()
          queryMode = 'd'
          break;
      }

      category = getCategories.map(category => {
        sumCase = [...sumCase, `SUM(CASE 
        WHEN ${queryMode}.name = '${category.name}'
            THEN a.quantity * a.price 
            ELSE 0 
        END) AS '${category.name}_amount', SUM(CASE 
        WHEN ${queryMode}.name = '${category.name}'
            THEN a.quantity
            ELSE 0 
        END) AS '${category.name}_qty'`]
        return category.name
      })
      
      hiData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date = '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})

      sdhiData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date BETWEEN '${moment().format('YYYY-MM')}-01' and '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})

      sdbiData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date BETWEEN '${moment().format('YYYY')}-01-01' and '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})

      summaryData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from transaction_items as a
      left join transactions as b on a.transaction_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date BETWEEN '${moment().format('YYYY')}-01-01' and '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})
    } catch (error) {
      console.log(error)
    }

    let getCategoriesData = [];

    switch (mode) {
      case 'product_sub_categories':
        getCategoriesData = await local.getSubCategory(type)
        break;
      case 'product_entries':
        getCategoriesData = await local.getProductEntries(type)
        break;
      default:
        getCategoriesData = await local.getCategories()
        break;
    }

    let sdbiResult = {}
    let dataTemplate = {}
    getCategoriesData.map(category => {
      dataTemplate = {...sdbiResult, [category.name+'_amount']:0, [category.name+'_qty']:0}
      return sdbiResult = {...sdbiResult, [category.name+'_amount']:0, [category.name+'_qty']:0}
    })

    sdbiData = sdbiData.map(data => {
      delete data.periode

      Object.keys(data).map(xData => {
        sdbiResult[xData]+=parseFloat(data[xData])
      })
      
      return data
    })

    sdbiData = sdbiResult
    
    if(hiData.length > 0){
      hiData = hiData.map(hiData => {
        let parsedInt = {}
        Object.keys(hiData).map(dataKey => {
          if(dataKey !== 'periode'){
            return parsedInt = {...parsedInt, [dataKey]: parseFloat(hiData[dataKey])}
          }
        })
        
        return parsedInt
      })[0]
    }else{
      hiData = dataTemplate
    }

    if(sdhiData.length > 0){
      sdhiData = sdhiData.map(sdhiData => {
        let parsedInt = {}
        Object.keys(sdhiData).map(dataKey => {
          if(dataKey !== 'periode'){
            return parsedInt = {...parsedInt, [dataKey]: parseFloat(sdhiData[dataKey])}
          }
        })
        
        return parsedInt
      })[0]
    }else{
      sdhiData = dataTemplate
    }

    let hiCard = 0
    let sdhiCard = 0
    let sdbiCard = 0

    Object.keys(hiData).filter(key => key.split('_')[1] === 'amount').map(key => hiCard+=hiData[key])
    Object.keys(sdhiData).filter(key => key.split('_')[1] === 'amount').map(key => sdhiCard+=sdhiData[key])
    Object.keys(sdbiData).filter(key => key.split('_')[1] === 'amount').map(key => sdbiCard+=sdbiData[key])

    return res.status(200).send({
      tableData: {
        hi: hiData,
        sdhi: sdhiData,
        sdbi: sdbiData
      },
      cardData: {
        hi: hiCard,
        sdhi: sdhiCard,
        sdbi: sdbiCard
      },
      summaryData: summaryData
    })
  },

  productionReport: async (req, res) => {
    const where = ''
    let {type, year, mode} = req.query
    let sumCase = []
    let allPeriod = []
    let category = []
    let hiData = []
    let sdhiData = []
    let sdbiData = []

    for (let index = 1; index <= 12; index++) {
      allPeriod = [...allPeriod, `${year ? year : moment().format('YYYY')}-${('0' + index).slice(-2)}`]
    }

    try {
      let getCategories = []
      let queryMode = 'xxx'

      switch (mode) {
        case 'product_sub_categories':
          getCategories = await local.getSubCategory(type)
          queryMode = 'e'
          break;
        case 'product_entries':
          getCategories = await local.getProductEntries(type)
          queryMode = 'c'
          break;
        default:
          getCategories = await local.getCategories()
          queryMode = 'd'
          break;
      }

      category = getCategories.map(category => {
        sumCase = [...sumCase, `SUM(CASE 
        WHEN ${queryMode}.name = '${category.name}'
            THEN a.quantity
            ELSE 0 
        END) AS '${category.name}_qty'`]
        return category.name
      })
      
      hiData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from production_details as a
      left join production as b on a.production_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date = '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})

      sdhiData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from production_details as a
      left join production as b on a.production_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date BETWEEN '${moment().format('YYYY-MM')}-01' and '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})

      sdbiData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from production_details as a
      left join production as b on a.production_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date BETWEEN '${moment().format('YYYY')}-01-01' and '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})

      summaryData = await sequelize.query(`select DATE_FORMAT(b.date, '%Y-%m') as periode, ${sumCase.join(',')}
      from production_details as a
      left join production as b on a.production_id = b.id
      left join product_entries as c on a.product = c.id
      left join product_categories as d on c.category_id = d.id
      left join product_sub_categories as e on c.sub_category_id = e.id
      where b.date BETWEEN '${moment().format('YYYY')}-01-01' and '${moment().format('YYYY-MM-DD')}'
      group by periode
      ${where}`, {nest:true})
    } catch (error) {
      console.log(error)
    }

    let getCategoriesData = [];

    switch (mode) {
      case 'product_sub_categories':
        getCategoriesData = await local.getSubCategory(type)
        break;
      case 'product_entries':
        getCategoriesData = await local.getProductEntries(type)
        break;
      default:
        getCategoriesData = await local.getCategories()
        break;
    }

    let sdbiResult = {}
    let dataTemplate = {}
    getCategoriesData.map(category => {
      dataTemplate = {...sdbiResult, [category.name+'_qty']:0}
      return sdbiResult = {...sdbiResult, [category.name+'_qty']:0}
    })

    sdbiData = sdbiData.map(data => {
      delete data.periode

      Object.keys(data).map(xData => {
        sdbiResult[xData]+=parseFloat(data[xData])
      })
      
      return data
    })

    sdbiData = sdbiResult
    
    if(hiData.length > 0){
      hiData = hiData.map(hiData => {
        let parsedInt = {}
        Object.keys(hiData).map(dataKey => {
          if(dataKey !== 'periode'){
            return parsedInt = {...parsedInt, [dataKey]: parseFloat(hiData[dataKey])}
          }
        })
        
        return parsedInt
      })[0]
    }else{
      hiData = dataTemplate
    }

    if(sdhiData.length > 0){
      sdhiData = sdhiData.map(sdhiData => {
        let parsedInt = {}
        Object.keys(sdhiData).map(dataKey => {
          if(dataKey !== 'periode'){
            return parsedInt = {...parsedInt, [dataKey]: parseFloat(sdhiData[dataKey])}
          }
        })
        
        return parsedInt
      })[0]
    }else{
      sdhiData = dataTemplate
    }

    let hiCard = 0
    let sdhiCard = 0
    let sdbiCard = 0

    Object.keys(hiData).filter(key => key.split('_')[1] === 'amount').map(key => hiCard+=hiData[key])
    Object.keys(sdhiData).filter(key => key.split('_')[1] === 'amount').map(key => sdhiCard+=sdhiData[key])
    Object.keys(sdbiData).filter(key => key.split('_')[1] === 'amount').map(key => sdbiCard+=sdbiData[key])

    return res.status(200).send({
      tableData: {
        hi: hiData,
        sdhi: sdhiData,
        sdbi: sdbiData
      },
      cardData: {
        hi: hiCard,
        sdhi: sdhiCard,
        sdbi: sdbiCard
      },
      summaryData: summaryData
    })
  },
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

  getSubCategory: async (categoryName) => {
    const result = await sequelize.query(`SELECT * FROM product_sub_categories WHERE category_id IN (SELECT id FROM product_categories WHERE name = '${categoryName}')`, {nest:true})

    return result
  },

  getProductEntries: async (subCategoryName) => {
    const result = await sequelize.query(`SELECT * FROM product_entries WHERE sub_category_id IN (SELECT id FROM product_sub_categories WHERE name = '${subCategoryName}')`, {nest:true})

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