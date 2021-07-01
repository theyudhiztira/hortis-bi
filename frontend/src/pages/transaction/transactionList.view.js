import numeral from 'numeral'
import React, { Component } from 'react'
import { IoEye, IoMail, IoPerson, IoPhonePortrait } from 'react-icons/io5'
import Swal from 'sweetalert2'
import handlers from './transactionList.handler'
import Pagination from '@material-ui/lab/Pagination'

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            data: [],
            totalPages: 0,
            tableElement: [],
            showDetails: false,
            transactionDetailsElement: []
        }
    }

    componentDidMount = async () => {
        this.loadTransactionData(null, null, 10)
    }

    loadTransactionData = async (from, to, limit, page) => {
        const {currentPage, totalPages, data} = await handlers.loadTransactionData(from, to, limit, page)
        let tableElement = []

        if(!data) return Swal.fire('Oops', 'Something went wrong please contact our team!', 'error')

        await data.map((value, index) => {
            return tableElement = [...tableElement, (<tr key={value.id}>
                <td className="text-sm p-2 font-normal text-center">{value.id}</td>
                <td className="text-sm p-2 font-normal text-center">{value.customer_id ? value.full_name : "-"}</td>
                <td className="text-sm p-2 font-normal text-center">{numeral(value.amount_due).format('0,0')}</td>
                <td className="text-sm p-2 font-normal text-center">{value.date}</td>
                <td className="text-sm p-2 font-normal text-center">
                    <button className="p-3 bg-blue-600 rounded text-white hover:bg-blue-700" onClick={() => this.openDetails(value.id)}><IoEye /></button>
                </td>
            </tr>)]
        })

        this.setState({
            totalPages: totalPages,
            currentPage: currentPage,
            tableElement: tableElement
        })
    }

    openDetails = async (transactionId) => {
        const trxDetails = await handlers.getDetails(transactionId)

        this.setState({
            transactionDetailsElement: [(
                <div className="w-full grid-cols-1 md:grid-cols-2">
                    {
                        trxDetails.customer_details ? <div className="text-left mb-3">
                            <label className="text-sm font-bold">Customer Details</label>
                            <div className="text-sm flex-row"><IoPerson className="flex" /> {trxDetails.customer_details.full_name}</div>
                            <div className="text-sm flex-row"><IoPhonePortrait className="flex" /> {trxDetails.customer_details.phone}</div>
                            <div className="text-sm flex-row"><IoMail className="flex" /> {trxDetails.customer_details.email}</div>
                        </div> : ""
                    }
                    <div className="text-left mb-3">
                        <label className="text-sm font-bold">Transaction Date</label>
                        <span className="text-sm flex">{trxDetails.date}</span>
                    </div>
                    <div className="text-left mb-3">
                        <label className="text-sm font-bold">Created By</label>
                        <span className="text-sm flex">{trxDetails.creator_details.full_name}</span>
                    </div>
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-gray-500">
                                <th className="text-gray-100 text-sm text-center font-medium py-2 px-2">Item</th>
                                <th className="text-gray-100 text-sm text-center font-medium py-2 px-2">Price</th>
                                <th className="text-gray-100 text-sm text-center font-medium py-2 px-2">Quantity</th>
                                <th className="text-gray-100 text-sm text-center font-medium py-2 px-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                trxDetails.items.map((item, index) => {
                                    return (<tr class="bg-white hover:bg-gray-100" key={index}>
                                        <td class="text-center py-2 text-sm px-2">{item.product_details.name}</td>
                                        <td class="text-center py-2 text-sm px-2">{numeral(item.price).format('0,0')}</td>
                                        <td class="text-center py-2 text-sm px-2">{item.quantity}</td>
                                        <td class="text-center py-2 text-sm px-2 text-right">{numeral(item.price * item.quantity).format('0,0')}</td>
                                    </tr>)
                                })
                            }
                        <tr className="bg-gray-500">
                            <td colSpan="3" className="text-white text-sm text-right p-2">Grand Total</td>
                            <td colSpan="3" className="text-white text-sm text-right p-2">{numeral(trxDetails.amount_due).format('0,0')}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            )],
            showDetails: true
        })
    }
    
    render() {
        return (<>
            <div className="grid grid-cols-1 gap-4 mt-5 bg-white shadow-xl rounded-lg p-5">
                <h3 className="text-xl font-semibold">Transaction List</h3>
                <div className="w-full h-full" >
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-gray-500">
                                <th className="text-gray-100 text-sm font-medium py-2 px-2">ID</th>
                                <th className="text-gray-100 text-sm font-medium py-2 px-2">Customer</th>
                                <th className="text-gray-100 text-sm font-medium py-2 px-2">Amount</th>
                                <th className="text-gray-100 text-sm font-medium py-2 px-2">Date</th>
                                <th className="text-gray-100 text-sm font-medium py-2 px-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.tableElement }
                        </tbody>
                    </table>
                </div>
                <div className="justify-center">
                    { this.state.totalPages ? 
                    <Pagination count={this.state.totalPages} shape="rounded" variant="outlined" color="primary" onChange={(ev, page) => this.loadTransactionData(this.state.from, this.state.page, 10, page)} /> : ""
                    }
                </div>
            </div>

            <div className={`fixed z-10 inset-0 overflow-y-scroll ${this.state.showDetails ? 'block' : 'hidden'} transition-all duration-150`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="grid grid-cols-1 gap-3">
                            {/* <div className="w-f"> */}
                                {this.state.transactionDetailsElement}
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" onClick={() => this.setState({
                            showDetails: false,
                            transactionDetails: {}
                        })} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Close
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </>);
    }
}

export default TransactionList;