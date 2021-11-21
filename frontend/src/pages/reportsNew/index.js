import React, { useEffect, useState } from 'react'
import Navigation from '../../components/navigation'
import { Line, Pie } from 'react-chartjs-2'
import { handlers } from './handlers'
import './components/style.css'
import numeral from 'numeral'
import { useHistory } from 'react-router-dom'
import * as moment from 'moment'
import { Button, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import DailyReportTable from './components/dailyReportTable'

const ReportsNew = () => {
  useEffect(() => {
    const fetchLineChart = async () => {
      const [result, error] = await handlers.fetchFirstLineChart()

      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setLineChart(result)
    }

    const fetchPieChart = async () => {
      const [result, error] = await handlers.fetchFirstPieChart()
      
      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setPieChart(result)
    }

    const fetchTextReport = async () => {
      const [result, error] = await handlers.fetchFirstTextChart()

      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setTextReport(result)
    }

    const fetchDailyChart = async () => {
      const [result, error] = await handlers.fetchDailyChart()

      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setDailyChart(result)
    }
    
    const fetchProductionReport = async () => {
      const [result, error] = await handlers.fetchProductionReport()

      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setProductionReport(result)
    }

    fetchPieChart()
    fetchLineChart()
    fetchTextReport()
    fetchDailyChart()
    fetchProductionReport()

    const refreshData = () => {
      fetchPieChart()
      fetchLineChart()
      fetchTextReport()
      fetchDailyChart()
      fetchProductionReport()
    }

    setInterval(() => {
      refreshData()
    }, 60000)
  }, [])


  const [lineChart, setLineChart] = useState({})
  const [pieChart, setPieChart] = useState({})
  const [textReport, setTextReport] = useState({})
  const [dailyChart, setDailyChart] = useState({})
  const [productionReport, setProductionReport] = useState({})
  const [toggleView, setToggleView] = useState(false)
  const history = useHistory()
  const userData = JSON.parse(localStorage.getItem('hortis_user'))

  const parseTableData = () => {
    const tableData = textReport.tableData
    const category = Object.keys(tableData.hi).filter(data => {
      return data.split('_')[1] !== 'qty'
    }).map(data => {
      return data.split('_')[0]
    })

    let result = category.map((data, key) => {
      return (<tr key={key}>
        <td onClick={() => history.push(`/report-second/${data}`)} className='cursor-pointer' style={{width: "15%"}}>{data}</td>
        <td>{tableData.hi[data+'_qty']}</td>
        <td>{numeral(tableData.hi[data+'_amount']).format('0,0.[00]')}</td>
        <td>{tableData.sdhi[data+'_qty']}</td>
        <td>{numeral(tableData.sdhi[data+'_amount']).format('0,0.[00]')}</td>
        <td>{numeral(tableData.sdbi[data+'_qty']).format('0,0.[00]')}</td>
        <td>{numeral(tableData.sdbi[data+'_amount']).format('0,0.[00]')}</td>
      </tr>)
    })

    return result
  }

  const parseProductionTable = () => {
    const tableData = productionReport.tableData

    const category = Object.keys(tableData.hi).map(data => {
      return data.split('_')[0]
    })

    let result = category.filter(data => data === "Buah Internal" | data === "Buah Eksternal").map((data, key) => {
      return (<tr key={key}>
        <td onClick={() => history.push(`/report-second/${data}`)} className='cursor-pointer'>{data}</td>
        <td>{tableData.hi[data+'_qty']}</td>
        <td>{tableData.sdhi[data+'_qty']}</td>
        <td>{numeral(tableData.sdbi[data+'_qty']).format('0,0.[00]')}</td>
      </tr>)
    })

    return result
  }

  const parseSummaryHeaderTable = () => {
    let head = []
    for (let i = 1; i <= 12; i++) {
      head = [...head, (<th style={{
        minWidth: 153
      }}>{`${moment().format('YYYY')}-${('0' + i).slice(-2)}`}</th>)]
    }

    return head
  }

  const parseSummaryDataTable = () => {
    const tableData = textReport.tableData
    const category = Object.keys(tableData.hi).filter(data => {
      return data.split('_')[1] !== 'qty'
    }).map(data => {
      return data.split('_')[0]
    })

    let result = category.map((data, key) => {
      let fisik = []
      let rupiah = []
      for (let i = 1; i <= 12; i++) {
        const isiData = textReport.summaryData.filter(data => data.periode === `${moment().format('YYYY')}-${('0' + i).slice(-2)}`).map(data => data)

        fisik = [...fisik, (<td title={data} style={{
          width: "4%"
        }}>{isiData.length > 0 ? numeral(isiData[0][`${data}_qty`]).format('0,0.[00]') : 0}</td>)]
        rupiah = [...rupiah, (<td title={data} style={{
          width: "4%"
        }}>{isiData.length > 0 ? numeral(isiData[0][`${data}_amount`]).format('0,0.[00]') : 0}</td>)]
      }
      let tableRow = (<React.Fragment>
      <tr className='bg-gray-300'>
        <td colSpan={13} className='text-center'>{data}</td>
      </tr>
      <tr>
        <td className='text-left'>Rupiah</td>
        {rupiah}
      </tr>
      <tr>
        <td className='text-left'>Fisik</td>
        {fisik}
      </tr>
      </React.Fragment>)
  
      return tableRow
    })

    let subTotal = {}

    for (let i = 1; i <= 12; i++) {
      const dataExtract = textReport.summaryData.filter(data => data.periode === `${moment().format('YYYY')}-${('0' + i).slice(-2)}`).map(data => data)

      subTotal = {...subTotal, [`${moment().format('YYYY')}-${('0' + i).slice(-2)}`]: dataExtract.length > 0 ? category.map(data => {
        return +dataExtract[0][`${data}_amount`]
      }).reduce((firstValue, secondValue) => firstValue + secondValue, 0) : 0}

    }

    result = [...result, (<tr key="subtotal">
      <td className='bg-gray-700 p-3'><b className='text-white'>Subtotal</b></td>
      {Object.values(subTotal).map((data, index) => {
        return (<>
          <td key={index} className='bg-gray-700 p-3'><b className='text-white'>{numeral(data).format('0,0.[00]')}</b></td>
        </>)
      })}
    </tr>)]

    return result
  }
  
  return (
    <div className="w-full bg-gray-200 h-full pb-3">
      <Navigation />
      <section className="w-full p-2 overflow-y-auto grid grid-cols-4 md:p-11 md:pl-80 gap-3" style={{
        paddingLeft: userData.role == 'user' ? '2rem' : '20rem'
      }}>
        <div className="bg-white col-span-4 flex-col pb-36 rounded-md shadow-md p-5 lg:pb-24 md:col-span-2" style={{
          height: 431
        }}>
          <h1 className="text-2xl font-semibold col-span-4">Porsi Transaksi</h1>
          {pieChart.datasets && <Pie data={pieChart} height={331} options={{
            onClick: (ev, el) => {
              const label = pieChart.labels[el[0]['index']]
              if(Object.keys(pieChart).length > 0){
                return history.push('/report-second/'+label.split(' - (')[0])
              }
            },
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'left'
              },
            }
          }} />}
        </div>

        <div className="col-span-4 grid gap-2 md:col-span-2" style={{
          height: 431,
          flexWrap: 'wrap',
          justifyContent: 'content'
        }}>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-md font-bold'>Total Hari Ini</h2>
            <div className='flex-grow flex'>
              <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.hi).format('0,0.[00]') : 0}</h1>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-md font-bold'>Total Kemarin</h2>
            <div className='flex-grow flex'>
              <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.yesterday).format('0,0.[00]') : 0}</h1>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-md font-bold'>Total Sampai Dengan Bulan Ini</h2>
            <div className='flex-grow flex'>
              <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.sdbi).format('0,0.[00]') : 0}</h1>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-md font-bold'>Total Sampai Dengan Bulan Ini</h2>
            <div className='flex-grow flex'>
              <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.sdbi).format('0,0.[00]') : 0}</h1>
            </div>
          </div>
        </div>
        <div className="bg-white col-span-4 flex-col pb-36 lg:pb-24 rounded-md shadow-md p-5" style={{
          height: 431
        }}>
          <h1 className="text-2xl font-semibold col-span-4">Trend Transaksi Bulanan</h1>
          {lineChart.datasets && <Line data={lineChart} options={{
            maintainAspectRatio : false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom'
              },
            }
          }}/>}
        </div>
        <div className="bg-white col-span-4 flex-col pb-36 lg:pb-24 rounded-md shadow-md p-5" style={{
          height: 431
        }}>
          <h1 className="text-2xl font-semibold col-span-4">Trend Transaksi Harian</h1>
          {dailyChart.datasets && <Line data={dailyChart} options={{
            maintainAspectRatio : false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom'
              },
            }
          }}/>}
        </div>
        

        <div className="bg-white flex-col col-span-4 rounded-md shadow-md p-5 " style={{
          height: 'auto'
        }}>
          <h1 className='text-2xl font-semibold'>
            Detail Laporan Penjualan
            <Button className="ml-2" onClick={() => {
              return setToggleView(!toggleView)
            }}>{toggleView ? "Hide" : "Show"}</Button>
          </h1> 
          <div className='w-full overflow-x-scroll' style={{
            display: toggleView ? "block" : "none"
          }}>
            <table className='w-full'>
              <thead className='bg-gray-500'>
                <tr>
                  <th rowSpan={2}>Produk</th>
                  <th colSpan={2}>HI</th>
                  <th colSpan={2}>SDHI</th>
                  <th colSpan={2}>SDBI</th>
                </tr>
                <tr>
                  <th>Fisik</th>
                  <th>Rupiah</th>
                  <th>Fisik</th>
                  <th>Rupiah</th>
                  <th>Fisik</th>
                  <th>Rupiah</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(textReport).length > 0 && parseTableData()
                }
              </tbody>
            </table>
          </div>
          <div className='w-full overflow-x-scroll' style={{
            display: toggleView ? "block" : "none"
          }}>
            <table className='w-full mt-3'>
              <thead className='bg-gray-500'>
                <tr>
                  <th style={{
                    width: "4%"
                  }} key={"UNIQUEDATA0001"}></th>
                  {
                    parseSummaryHeaderTable()
                  }
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(textReport).length > 0 && parseSummaryDataTable()
                }
              </tbody>
            </table>
          </div>
          <div className='w-full overflow-x-scroll my-5' style={{
            display: toggleView ? "block" : "none"
          }}>
            {dailyChart.datasets && <DailyReportTable header={dailyChart.labels} datatable={dailyChart.datasets} />}
          </div>
        </div>
        
        <div className="bg-white flex-col col-span-4 rounded-md shadow-md p-5 " style={{
          height: 'auto'
        }}>
          <h1 className='text-2xl font-semibold'>Detail Laporan Produksi</h1>
          <div className='w-full overflow-x-scroll'>
            <table className='w-full'>
              <thead className='bg-gray-500'>
                <tr>
                  <th>Produk</th>
                  <th>HI</th>
                  <th>SDHI</th>
                  <th>SDBI</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(productionReport).length > 0 && parseProductionTable()
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ReportsNew