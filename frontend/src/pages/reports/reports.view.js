import React, { Component } from 'react'
import Navigation from '../../components/navigation'
import { Line, Pie } from 'react-chartjs-2'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import moment from 'moment'
import handlers from './reports.handler'
import { ItemTable } from './transactionTable/transactionTable'
import { IoCloudDownloadOutline } from 'react-icons/io5'

class ReportPage extends Component {
    constructor(props) {
      super(props)
      this.state = {
          lineChart: {},
          annualPieChart: {},
          monthlyPieChart: {},
          options: {},
          selectedYear: new Date(),
          reportingMode: 'category',
          reportingType: 'income',
          tableData: {},
          transactionByCategory: {},
          transactionByItem: {},
      }
    }

    componentDidMount = async () => {
        const chartData = await handlers.loadChartDataset(this.state.reportingMode, this.state.selectedYear, this.state.reportingType)
        const tableData = await handlers.loadTableData(this.state.selectedYear)

        this.setState({
          lineChart: chartData.lineChart,
          annualPieChart: chartData.annualPieChart,
          monthlyPieChart: chartData.monthlyPieChart,
          transactionByCategory: tableData.byCategory,
          transactionByItem: tableData.byItem,
        })
    }

    handleChange = (el) => {
      this.setState({
        [el.target.name]:el.target.value
      })
    }

    refreshData = async (el) => {
      await this.setState({
        [el.target.name]:el.target.value
      })

      const chartData = await handlers.loadChartDataset(this.state.reportingMode, this.state.selectedYear, this.state.reportingType)
      const tableData = await handlers.loadTableData(this.state.selectedYear)

      this.setState({
        lineChart: chartData.lineChart,
        annualPieChart: chartData.annualPieChart,
        monthlyPieChart: chartData.monthlyPieChart,
        transactionByCategory: tableData.byCategory,
        transactionByItem: tableData.byItem,
      })
    }

    render() { 
        return (
            <>
                <div className="w-full h-full flex flex-col">
                    <Navigation />
                    <section className="ml-0 md:ml-64 bg-gray-500 min-h-screen h-auto">
                        <div className="container mx-auto px-3 py-7 md:py-16 md:px-16">
                          <h2 className="text-2xl md:text-4xl font-semibold text-white">Reports</h2>
                          <div className="w-full grid grid-cols-4 gap-3 mt-3">
                            <div className="bg-white pb-36 lg:pb-24 px-7 pt-5 rounded-lg col-span-4" style={{
                              height: 431
                            }}>
                              <div className="w-100 grid grid-cols-3 lg:grid-cols-4 gap-3 my-3">
                                <h1 className="text-2xl font-semibold col-span-3 lg:col-span-1">
                                  Progress Report
                                </h1>
                                <select className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" name='reportingMode' value={this.state.reportingMode} onChange={async (el) => {
                                  await this.refreshData(el)
                                }} >
                                  <option value='category'>By Category</option>
                                  <option value='item'>By Item</option>
                                </select>
                                <select className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" name='reportingType' value={this.state.reportingType} onChange={async (el) => {
                                  await this.refreshData(el)
                                }} >
                                  <option value='income'>By Income</option>
                                  <option value='quantity'>By Quantity</option>
                                </select>
                                <DatePicker showYearPicker dateFormat="yyyy" className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" placeholder={moment().format('YYYY')} selected={this.state.selectedYear} onChange={async date => {
                                  await this.refreshData({
                                    target: {
                                      name: 'selectedYear',
                                      value: date
                                    }
                                  })
                                }}  />
                              </div>
                              <Line data={this.state.lineChart} options={{
                                maintainAspectRatio : false,
                                scales: {
                                  y: {
                                    beginAtZero: true
                                  }
                                }
                              }} />
                            </div>
                            <div className="bg-white pb-36 lg:pb-24 px-7 pt-5 rounded-lg col-span-4 md:col-span-2" style={{
                              height: 371
                            }}>
                              <h1 className="text-xl font-semibold w-full mb-6">
                                Annual Transaction Portion
                              </h1>
                              <Pie data={this.state.annualPieChart} height={331} options={{
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: true,
                                    position: 'left'
                                  },
                                }
                              }} />
                            </div>
                            <div className="bg-white pb-36 lg:pb-24 px-7 pt-5 rounded-lg col-span-4 md:col-span-2" style={{
                              height: 371
                            }}>
                              <h1 className="text-xl font-semibold w-full mb-6">
                                Current Period Transaction Portion ({moment().format('YYYY-MM')})
                              </h1>
                              <Pie data={this.state.monthlyPieChart} height={331} options={{
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: true,
                                    position: 'left'
                                  },
                                }
                              }} />
                            </div>

                            {/* Table Reports */}
                            <div className="bg-white pb-8 px-7 pt-5 rounded-lg col-span-4 md:col-span-2">
                              <h1 className="text-xl font-semibold w-full mb-6">
                                Anually Transaction By Item
                              </h1>
                              <div className='h-auto w-full overflow-y-scroll shadow' style={{
                                height: 512
                              }}>
                              { Object.keys(this.state.transactionByItem).length > 0 && <ItemTable data={this.state.transactionByItem} />}
                              </div>
                            </div>

                            <div className="bg-white pb-8 px-7 pt-5 rounded-lg col-span-4 md:col-span-2">
                              <h1 className="text-xl font-semibold w-full mb-6">
                                Anually Transaction By Category
                              </h1>
                              <div className='h-auto w-full overflow-y-scroll shadow' style={{
                                height: 512
                              }}>
                              { Object.keys(this.state.transactionByCategory).length > 0 && <ItemTable data={this.state.transactionByCategory} />}
                              </div>
                            </div>
                          
                            <div className="col-span-4 mt-3">
                              <a 
                                className='transition duration-300 bg-green-600 p-4 w-full inline-block text-center rounded-lg shadow-lg hover:bg-green-700 text-white font-semibold'
                                rel='noreferrer'
                                target='_blank'
                                href={`${process.env.REACT_APP_API_URL}/download-report-pdf?year=${moment(this.state.selectedYear).format('YYYY')}`}
                                title='Download Report'
                              >
                                <IoCloudDownloadOutline className='inline-block mr-1 font-semibold' />
                                Download Report
                              </a>
                            </div>
                          </div>
                        </div>
                    </section>
                </div>
            </>
        )
    }
}

export default ReportPage;