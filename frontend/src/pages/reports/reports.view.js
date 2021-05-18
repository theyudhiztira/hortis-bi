import React, { Component } from 'react'
import Navigation from '../../components/navigation'
import { Line, Pie } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import moment from 'moment'
import handlers from './reports.handler'

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
            reportingType: 'income'
        }
    }

    componentDidMount = async () => {
        const data = await handlers.loadChartDataset(this.state.reportingMode, this.state.selectedYear, this.state.reportingType)

        this.setState({
          lineChart: data.lineChart,
          annualPieChart: data.annualPieChart,
          monthlyPieChart: data.monthlyPieChart,
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

      const data = await handlers.loadChartDataset(this.state.reportingMode, this.state.selectedYear, this.state.reportingType)

      this.setState({
        lineChart: data.lineChart,
        annualPieChart: data.annualPieChart,
        monthlyPieChart: data.monthlyPieChart,
      })
    }

    render() { 
        return (
            <>
                <div className="w-full h-full flex flex-col">
                    <Navigation />
                    <section className="ml-0 md:ml-64 bg-gray-100 min-h-screen h-auto">
                        <div className="container mx-auto px-10 py-7 md:py-16 md:px-16">
                            <h2 className="text-2xl md:text-4xl font-semibold">Reports</h2>
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
                                    datalabels: {
                                      formatter: (value, ctx) => {
                                        let datasets = ctx.chart.data.datasets;
                                        if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                                          let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                                          let percentage = Math.round((value / sum) * 100) + '%';
                                          return percentage;
                                        } else {
                                          return '0%';
                                        }
                                      },
                                      color: '#fff',
                                    }
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
                                    datalabels: {
                                      formatter: (value, ctx) => {
                                        let datasets = ctx.chart.data.datasets;
                                        if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                                          let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                                          let percentage = Math.round((value / sum) * 100) + '%';
                                          return percentage;
                                        } else {
                                          return '0%';
                                        }
                                      },
                                      color: '#fff',
                                    }
                                  }
                                }} />
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