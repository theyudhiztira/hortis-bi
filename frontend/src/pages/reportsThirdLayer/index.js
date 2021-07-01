import React, { useEffect, useState } from 'react'
import Navigation from '../../components/navigation'
import { Line, Pie } from 'react-chartjs-2'
import { handlers } from './handlers'
import './components/style.css'
import numeral from 'numeral'
import { IoCaretBack } from 'react-icons/io5'

const ReportsThirdLayer = (props) => {
  useEffect(() => {
    const fetchLineChart = async () => {
      const [result, error] = await handlers.fetchFirstLineChart(props.match.params.data)

      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setLineChart(result)
    }

    const fetchPieChart = async () => {
      const [result, error] = await handlers.fetchFirstPieChart(props.match.params.data)
      
      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setPieChart(result)
    }

    const fetchTextReport = async () => {
      const [result, error] = await handlers.fetchFirstTextChart(props.match.params.data)

      if(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }

      setTextReport(result)
    }

    fetchPieChart()
    fetchLineChart()
    fetchTextReport()
    // eslint-disable-next-line
  }, [])

  const [lineChart, setLineChart] = useState({})
  const [pieChart, setPieChart] = useState({})
  const [textReport, setTextReport] = useState({})

  const parseTableData = () => {
    const tableData = textReport.tableData
    const category = Object.keys(tableData.hi).filter(data => {
      return data.split('_')[1] !== 'qty'
    }).map(data => {
      return data.split('_')[0]
    })

    const result = category.map((data, key) => {
      return (<tr key={key}>
        <td>{data}</td>
        <td>{tableData.hi[data+'_qty']}</td>
        <td>{numeral(tableData.hi[data+'_amount']).format('0,0')}</td>
        <td>{tableData.sdhi[data+'_qty']}</td>
        <td>{numeral(tableData.sdhi[data+'_amount']).format('0,0')}</td>
        <td>{tableData.sdbi[data+'_qty']}</td>
        <td>{numeral(tableData.sdbi[data+'_amount']).format('0,0')}</td>
      </tr>)
    })

    return result
  }

  return (
    <div className="w-full bg-gray-200 h-full pb-3">
      <Navigation isFlex={false} />
      <section className="w-full p-2 overflow-y-auto grid grid-cols-4 md:p-11 md:pl-80 gap-3">
        <div className='flex-row'>
          <h1 className='text-blue-600 cursor-pointer hover:underline' onClick={() => props.history.goBack()}><IoCaretBack className='inline-block' /> Back</h1>
        </div>
        <div className="bg-white col-span-4 flex-col pb-36 lg:pb-24 rounded-md shadow-md p-5" style={{
          height: 431
        }}>
          <h1 className="text-2xl font-bold col-span-4">Trend Transaksi</h1>
          <Line data={lineChart} options={{
            maintainAspectRatio : false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}/>
        </div>
        <div className="bg-white col-span-4 flex-col pb-36 rounded-md shadow-md p-5 lg:pb-24 md:col-span-2" style={{
          height: 431
        }}>
          <h1 className="text-2xl font-bold col-span-4">Porsi Transaksi</h1>
          <Pie data={pieChart} height={331} options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'left'
              },
            }
          }} />
        </div>

        <div className="col-span-4 grid gap-2 md:col-span-2" style={{
          height: 431,
          flexWrap: 'wrap',
          justifyContent: 'content'
        }}>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-lg font-bold'>Total Hari Ini</h2>
            <div className='flex-grow flex'>
              <h1 className='text-5xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.hi).format('0,0') : 0}</h1>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-lg font-bold'>Total Sampai Dengan Hari Ini</h2>
            <div className='flex-grow flex'>
              <h1 className='text-5xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.sdhi).format('0,0') : 0}</h1>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch'>
            <h2 className='text-lg font-bold'>Total Sampai Dengan Bulan Ini</h2>
            <div className='flex-grow flex'>
              <h1 className='text-5xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.sdbi).format('0,0') : 0}</h1>
            </div>
          </div>
        </div>

        <div className="bg-white flex-col col-span-4 pb-36 lg:pb-24 rounded-md shadow-md p-5" style={{
          height: 431
        }}>
          <h1 className='text-2xl font-bold'>Detail Transaksi</h1>
          <table className='w-full'>
            <thead className='bg-gray-500'>
              <tr>
                <th rowSpan={2}>Produk</th>
                <th colSpan={2}>HI</th>
                <th colSpan={2}>SDHI</th>
                <th colSpan={2}>SDBI</th>
              </tr>
              <tr>
                <th>Jml</th>
                <th>Rupiah</th>
                <th>Jml</th>
                <th>Rupiah</th>
                <th>Jml</th>
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
      </section>
    </div>
  )
}

export default ReportsThirdLayer