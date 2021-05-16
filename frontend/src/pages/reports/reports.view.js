import React, { Component } from 'react'
import Navigation from '../../components/navigation'
import { Line } from 'react-chartjs-2'
import apiCaller from '../../services/apiCaller'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import moment from 'moment'

class ReportPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: {},
            options: {},
            selectedYear: new Date()
        }
    }

    componentDidMount = async () => {
        try{
            const getData = await apiCaller.get('report')

            this.setState({
                chartData: getData.data
            })
        }catch(err){

        }
    }

    render() { 
        return (
            <>
                <div className="w-full h-full flex flex-col">
                    <Navigation />
                    <section className="ml-0 md:ml-64 bg-gray-100 min-h-screen h-auto">
                        <div className="container mx-auto px-10 py-7 md:py-16 md:px-16">
                            <h2 className="text-2xl md:text-4xl font-semibold">Reports</h2>
                            <div className="w-full grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-white pb-24 px-12 pt-5 rounded-lg col-span-2" style={{
                                height: 431
                              }}>
                                <div className="w-100 grid grid-cols-3 gap-3 my-3">
                                  <h1 className="text-2xl font-semibold">
                                    Progress Report
                                  </h1>
                                  <select className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full">
                                    <option>By Category</option>
                                    <option>By Item</option>
                                  </select>
                                  <DatePicker showYearPicker dateFormat="yyyy" className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" placeholder={moment().format('YYYY')} selected={this.state.selectedYear} onChange={date => this.setState({selectedYear:date})}  />
                                </div>
                                <Line data={this.state.chartData} options={{
                                  maintainAspectRatio : false
                                }} />
                              </div>
                              <div className="bg-white pb-24 px-12 pt-5 rounded-lg" style={{
                                height: 431
                              }}>
                                <div className="w-100 grid grid-cols-3 gap-3 my-3">
                                  <h1 className="text-2xl font-semibold">
                                    Progress Report
                                  </h1>
                                  <select className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full">
                                    <option>By Category</option>
                                    <option>By Item</option>
                                  </select>
                                  <DatePicker showYearPicker dateFormat="yyyy" className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" placeholder={moment().format('YYYY')} selected={this.state.selectedYear} onChange={date => this.setState({selectedYear:date})}  />
                                </div>
                                <Line data={this.state.chartData} options={{
                                  maintainAspectRatio : false
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