import React, {Component} from 'react'
import Navigation from '../components/navigation'
import Creatable from 'react-select/creatable'
import apiCaller from '../services/apiCaller'
import moment from 'moment'
import Swal from 'sweetalert2'
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";

class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            customers: [],
            showCustomerModal: false,
            showProductModal: false,
            selectedCustomer: null,
            newCustomerName: "",
            newCustomerEmail: "",
            newCustomerPhone: "",
            date: new Date(),
            isLoading: false,
            cartItems: []
        }
    }

    handleInputChange = (val) => {
        return this.setState({
            [val.target.name]: val.target.value
        })
    }

    hideCustomerModal = () => {
        return this.setState({
            showCustomerModal: !this.state.showCustomerModal,
            newCustomerName: "",
            newCustomerEmail: "",
            newCustomerPhone: ""
        })
    }

    hideProductModal = () => {
        return this.setState({
            showProductModal: !this.state.showProductModal,
            newProduct: "",
            newProductQty: "",
        })
    }

    onCustomerCreated = (val) => {
        return this.setState({
            showCustomerModal: true
        })
    }

    onCustomerChanged = (val) => {
        return this.setState({
            selectedCustomer: val
        })
    }

    showItems = () => {
        return this.state.cartItems.map(item => {
            return (
                <tr className="bg-white hover:bg-gray-100">
                    <td className="text-center py-2 text-sm">1</td>
                    <td className="text-center py-2 text-sm">10001</td>
                    <td className="text-center py-2 text-sm">Kiwi</td>
                    <td className="text-center py-2 text-sm">Buah</td>
                    <td className="text-center py-2 text-sm">10,000</td>
                    <td className="text-center py-2 text-sm">Pcs</td>
                    <td className="text-center py-2 text-sm">2</td>
                </tr>
            )
        })
    }

    componentDidMount = async () => {
        this.getCustomerList()
    }

    submitNewCustomer = async () => {
        try{
            const saveNewCustomer = await apiCaller.post('customer', {
                full_name: this.state.newCustomerName,
                email: this.state.newCustomerEmail,
                phone: this.state.newCustomerPhone
            })

            this.getCustomerList()
            
            const savedCustomer = saveNewCustomer.data

            this.hideCustomerModal()

            return this.setState({
                selectedCustomer: {
                    value: savedCustomer.id,
                    label: `${savedCustomer.full_name} - ${savedCustomer.phone} - ${savedCustomer.email}`
                }
            })
        }catch(err){
            console.log(err)
            if(err.response.status === 422){
                return Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: err.response.data.message
                }).then(() => {
                    return this.setState({
                        isLoading: false
                    })
                })
            }
        }
    }

    getCustomerList = async () => {
        try{
            const customerData = await apiCaller.get('customer')

            await customerData.data.map(v => {
                return this.setState({
                    customers: [
                        ...this.state.customers, {value: v.id, label: `${v.full_name} - ${v.phone} - ${v.email}`}
                    ]
                })
            })
        }catch(err){
            console.log(err)
        }
    }

    render() { 
        return (
            <>
                <div className="w-full h-full flex flex-col">
                    <Navigation />
                    <div className={`fixed z-10 inset-0 overflow-y-auto ${this.state.showCustomerModal ? 'block' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col">
                                        <label className="text-xs">Full Name <b className="text-red-400 font-normal">*</b></label>
                                        <input type="text" placeholder="Customer Name" className="p-2 text-sm border border-gray-300 rounded mt-1" value={this.state.newCustomerName} name="newCustomerName" onChange={(val) => this.handleInputChange(val)} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs">Email</label>
                                        <input type="email" placeholder="Customer Email" className="p-2 text-sm border border-gray-300 rounded mt-1" value={this.state.newCustomerEmail} name="newCustomerEmail" onChange={(val) => this.handleInputChange(val)} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs">Phone</label>
                                        <input type="text" placeholder="Customer Phone" className="p-2 text-sm border border-gray-300 rounded mt-1" value={this.state.newCustomerPhone} name="newCustomerPhone" onChange={(val) => this.handleInputChange(val)} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button disabled={this.state.isLoading} type="button" onClick={() => this.submitNewCustomer()} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${!this.state.isLoading ? "bg-green-500 hover:bg-green-700" : "bg-gray-300 hover:bg-green-400"}`}>
                                {this.state.isLoading ? "Loading ..." : "Submit"}
                                </button>
                                <button type="button" onClick={() => this.hideCustomerModal()} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" disabled={this.state.isLoading}>
                                Cancel
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                    <section className="ml-0 md:ml-64 bg-gray-100 min-h-screen h-auto">
                        <div className="container mx-auto px-10 py-7 md:py-16 md:px-16">
                            <h2 className="text-2xl md:text-4xl font-semibold">Transactions</h2>
                            <div className="grid grid-cols-1 gap-4 mt-5 bg-white shadow-xl rounded-lg p-5">
                                <div>
                                    <h1 className="w-100 text-lg md:text-xl font-semibold">Create New Transactions</h1>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm mb-3">Customer <b className="text-gray-500 font-normal text-xs">(Optional)</b></label>
                                        <Creatable value={this.state.selectedCustomer} options={this.state.customers} className="text-sm" isClearable={true} placeholder="Select customer..." onCreateOption={(val) => this.onCustomerCreated(val) } onChange={(val) => this.onCustomerChanged(val)} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm mb-3">Date <b className="text-red-500 font-normal text-xs">*</b></label>
                                        <DatePicker className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" placeholder={moment().format('YYYY-MM-DD')} selected={this.state.date} onChange={date => this.setState({date:date})} />
                                    </div>

                                    {/* Transaction Input */}
                                    <div className="inline-block col-span-1 md:col-span-2 mt-3">
                                        <label className="text-sm mb-3 inline-block w-14 float-left mt-4">Items <b className="text-red-500 font-normal text-xs">*</b></label>
                                        <label className="text-sm mb-3 right-0 inline-block w-auto float-right">
                                            <button className="bg-green-400 rounded-md px-3 py-2 text-white" onClick={() => this.setState({showProductModal:true})}>+ Add Item</button>
                                        </label>
                                        <div className="min-w-full leading-normal overflow-x-auto min-h-full">
                                            <table className="table-auto w-full">
                                                <thead>
                                                    <tr className="bg-gray-500">
                                                        <th className="w-1/12 text-gray-100 text-sm font-medium py-2 px-2">No.</th>
                                                        <th className="text-gray-100 text-sm font-medium py-2 px-2"><b className="font-medium hidden md:inline-block">Product&nbsp;</b>ID</th>
                                                        <th className="w-3/12 text-gray-100 text-sm font-medium py-2 px-2"><b className="font-medium hidden md:inline-block">Product&nbsp;</b>Name</th>
                                                        <th className="w-2/12 text-gray-100 text-sm font-medium py-2 px-2">Category</th>
                                                        <th className="text-gray-100 text-sm font-medium py-2 px-2">Price</th>
                                                        <th className="text-gray-100 text-sm font-medium py-2 px-2">Unit</th>
                                                        <th className="text-gray-100 text-sm font-medium py-2 px-2">Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.cartItems.length > 1 && this.showItems()}
                                                    {this.state.cartItems.length < 1 && (
                                                        <tr>
                                                            <td colSpan={7} className="text-left md:text-center py-2 text-sm">
                                                                No Item Added
                                                            </td>
                                                        </tr>
                                                    )}
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                
                                    {/* Product Modal */}
                                    <div className={`fixed z-10 inset-0 overflow-y-auto ${this.state.showProductModal ? 'block' : 'hidden'} transition-all duration-150`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="flex flex-col">
                                                        <label className="text-xs">Full Name <b className="text-red-400 font-normal">*</b></label>
                                                        <input type="text" placeholder="Customer Name" className="p-2 text-sm border border-gray-300 rounded mt-1" value={this.state.newCustomerName} name="newCustomerName" onChange={(val) => this.handleInputChange(val)} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="text-xs">Email</label>
                                                        <input type="email" placeholder="Customer Email" className="p-2 text-sm border border-gray-300 rounded mt-1" value={this.state.newCustomerEmail} name="newCustomerEmail" onChange={(val) => this.handleInputChange(val)} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="text-xs">Phone</label>
                                                        <input type="text" placeholder="Customer Phone" className="p-2 text-sm border border-gray-300 rounded mt-1" value={this.state.newCustomerPhone} name="newCustomerPhone" onChange={(val) => this.handleInputChange(val)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                <button disabled={this.state.isLoading} type="button" onClick={() => this.addNewProduct()} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${!this.state.isLoading ? "bg-green-500 hover:bg-green-700" : "bg-gray-300 hover:bg-green-400"}`}>
                                                {this.state.isLoading ? "Loading ..." : "Submit"}
                                                </button>
                                                <button type="button" onClick={() => this.hideProductModal()} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" disabled={this.state.isLoading}>
                                                Cancel
                                                </button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        )
    }
}

export default Transaction