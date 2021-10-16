import React, {Component} from 'react'
import Navigation from '../../components/navigation'
import Creatable from 'react-select/creatable'
import Select from 'react-select'
import apiCaller from '../../services/apiCaller'
import moment from 'moment'
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker'
import numeral from 'numeral'
import {
    IoTrashOutline
} from 'react-icons/io5'

import "react-datepicker/dist/react-datepicker.css";
import TransactionList from './transactionList.view'

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
            cartItems: [],
            subTotal: 0,
            productList: [],
            categoryList: [],
            selectableProductValue: null,
            disabledProduct: [],
            selectedProduct: {
                product: {},
                quantity: ""
            }
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
            selectableProductValue: null,
            showProductModal: !this.state.showProductModal,
            selectedProduct: {
                product: {},
                quantity: 0
            }
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

    addNewProduct = () => {
        if(this.state.selectableProductValue === null){
            return Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Please choose product!'
            }).then(() => {
                return this.setState({
                    isLoading: false
                })
            })
        }

        if(this.state.selectedProduct.quantity < 1){
            return Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Please add quantity!'
            }).then(() => {
                return this.setState({
                    isLoading: false
                })
            })
        }

        let productList = this.state.productList;
        for (let i = 0; i < productList.length; i++) {
            if(this.state.selectedProduct.product.id === productList[i].value){
                this.setState({
                    disabledProduct: [...this.state.disabledProduct, productList[i]]
                })

                productList.splice(i, 1)
            }
        }

        this.setState({
            productList: productList,
            cartItems: [...this.state.cartItems, this.state.selectedProduct]
        })

        return this.hideProductModal()
    }

    fetchProducts = async () => {
        try{
            const productData = await apiCaller.get('product')

            await productData.data.map(v => {
                if(v.status === "1"){
                    return this.setState({
                        productList: [
                            ...this.state.productList, {value: v.id, label: `[${v.category_details.name}] ${v.name} - Rp. ${numeral(v.price_per_unit_retail).format('0,0.[00]')} / ${v.unit}`}
                        ]
                    })
                }

                return false
            })
        }catch(err){
            console.error(err)
        }
    }

    showItems = () => {
        return this.state.cartItems.map((value, index) => {
            return (
                <tr className="bg-white hover:bg-gray-100" key={index}>
                    <td className="text-center py-2 text-sm">{index+1}</td>
                    <td className="text-center py-2 text-sm">{value.product.id}</td>
                    <td className="text-center py-2 text-sm">{value.product.name}</td>
                    <td className="text-center py-2 text-sm">{value.product.category_details.name}</td>
                    <td className="text-center py-2 text-sm">{numeral(value.product.price_per_unit_retail).format('0,0.[00]')}</td>
                    <td className="text-center py-2 text-sm">{value.product.unit}</td>
                    <td className="text-center py-2 text-sm">{numeral(value.quantity).value()}</td>
                    <td className="text-center py-2 text-sm">{numeral(value.quantity * value.product.price_per_unit_retail).format('0,0.[00]')}</td>
                    <td className="text-center py-2 text-sm gap-2">
                        <button className="mx-auto p-2 bg-red-400 hover:bg-red-600 hover:text-white rounded" onClick={() => this.removeItem(value.product, index)}><IoTrashOutline /></button>
                    </td>
                </tr>
            )
        })
    }

    removeItem = (val, index) => {
        let newCartItems = this.state.cartItems
        newCartItems.splice(index, 1)
        this.setState({
            cartItems: newCartItems
        })

        return this.setState({
            productList: [
                ...this.state.productList, {value: val.id, label: `[${val.category_details.name}] ${val.name} - Rp. ${numeral(val.price_per_unit_retail).format('0,0.[00]')} / ${val.unit}`}
            ]
        })
    }

    componentDidMount = async () => {
        this.getCustomerList()
        this.fetchProducts()
    }

    saveTransaction = () => {
        let dataToUpload = {
            date: moment(this.state.date).format("YYYY-MM-DD")
        }

        let cartItems = []
        let itemTable = ""
        let grandTotal = 0
        let customerDetails = {}

        this.state.cartItems.map(v => {
            cartItems = [...cartItems, {
                product_id: v.product.id,
                quantity: v.quantity
            }]

            grandTotal+=v.product.price_per_unit_retail*v.quantity

            return itemTable+=`<tr class="bg-white hover:bg-gray-100"><td class="text-center py-2 text-sm px-2">${v.product.name}</td><td class="text-center py-2 text-sm px-2">${numeral(v.product.price_per_unit_retail).format('0,0.[00]')}</td><td class="text-center py-2 text-sm px-2">${v.quantity}</td><td class="text-center py-2 text-sm px-2 text-right">${numeral(v.product.price_per_unit_retail * v.quantity).format('0,0.[00]')}</td></tr>\n`
        })

        dataToUpload = {...dataToUpload, cart: cartItems}

        if(this.state.selectedCustomer){
            const customerSplitted = (this.state.selectedCustomer.label).split(" - ")
            dataToUpload = {...dataToUpload, customer_id: this.state.selectedCustomer.value}

            customerDetails = {
                name: customerSplitted[0],
                phone: customerSplitted[1],
                email: customerSplitted[2]
            }
        }

        return Swal.fire({
            icon: 'info',
            html:
            `
            <div class="w-100">
                <div class="font-bold text-left text-red-400 text-sm mb-3">Please check your transaction submission! Once the transaction submitted you won't be able to change it!</div>
                ${customerDetails.name ? `<div class="flex flex-col text-left mb-3">
                    <label class="text-sm font-bold">Customer Details</label>
                    <span class="text-sm">Name  : ${customerDetails.name}</span>
                    <span class="text-sm">Phone : ${customerDetails.phone}</span>
                    <span class="text-sm">Email : ${customerDetails.email}</span>
                </div>`: ``}
                <div class="flex flex-col text-left mb-3">
                    <label class="text-sm font-bold">Transaction Date</label>
                    <span class="text-sm">${dataToUpload.date}</span>
                </div>
            </div>
            <table class="table-auto w-full">
                <thead>
                    <tr class="bg-gray-500">
                        <th class="text-gray-100 text-sm font-medium py-2 px-2">Item</th>
                        <th class="text-gray-100 text-sm font-medium py-2 px-2">Price</th>
                        <th class="text-gray-100 text-sm font-medium py-2 px-2">Quantity</th>
                        <th class="text-gray-100 text-sm font-medium py-2 px-2">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                ${itemTable}
                <tr class="bg-gray-500">
                    <td colspan=3 class="text-white text-sm text-right p-2">Grand Total</td>
                    <td colspan=3 class="text-white text-sm text-right p-2">${numeral(grandTotal).format('0,0.[00]')}</td>
                </tr>
                </tbody>
            </table>`,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: 'rgba(16, 185, 129, 1)',
            confirmButtonText:
            'Submit',
            cancelButtonText:
            'Cancel'
        }).then(async (res) => {
            if(res.value){
                try{
                    await apiCaller.post('transaction', dataToUpload)

                    return window.location.reload()
                }catch(err){
                    Swal.fire('Oops', 'Error Please Contact Our Team!', 'error')
                }
            }
        })
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
            console.error(err)
        }
    }

    onProductSelected = async (val) => {
        if(val){
            try{
                const productData = await apiCaller.get(`product/${val.value}`)

                await this.setState({
                    selectableProductValue: val,
                    selectedProduct: {
                        ...this.state.selectedProduct, product: productData.data
                    }
                })

                if(this.state.selectedProduct.quantity && !this.state.selectedProduct.product.is_unlimited > productData.data.stock){
                    await this.setState({
                        selectedProduct: {
                            ...this.state.selectedProduct, quantity: productData.data.stock
                        }
                    })
                }
            }catch(err){
                console.err(err)
            }
        }else{
            await this.setState({
                selectableProductValue: null,
                selectedProduct: {
                    product: {},
                    quantity: 0
                }
            })
        }
    }

    render() { 
        const calculateGrandTotal = () => {
            let total = 0
            for (let i = 0; i < this.state.cartItems.length; i++) {
                total += this.state.cartItems[i].product.price_per_unit_retail * this.state.cartItems[i].quantity
            }

            return numeral(total).format('0,0.[00]')
        }

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
                                        <DatePicker dateFormat="yyyy-MM-dd" className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 w-full" placeholder={moment().format('YYYY-MM-DD')} selected={this.state.date} onChange={date => this.setState({date:date})} />
                                    </div>

                                    {/* Transaction Input */}
                                    <div className="inline-block col-span-1 md:col-span-2 mt-3">
                                        <label className="text-sm mb-3 inline-block w-14 float-left mt-4">Items <b className="text-red-500 font-normal text-xs">*</b></label>
                                        <label className="text-sm mb-3 right-0 inline-block w-auto float-right">
                                            <button className="bg-green-500 rounded-md px-3 py-2 text-white" onClick={() => this.setState({showProductModal:true})}>+ Add Item</button>
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
                                                        <th className="text-gray-100 text-sm font-medium py-2 px-2">Subtotal</th>
                                                        <th className="text-gray-100 text-sm font-medium py-2 px-2">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.cartItems.length > 0 && this.showItems()}
                                                    {this.state.cartItems.length < 1 && (
                                                        <tr>
                                                            <td colSpan={8} className="text-left md:text-center py-2 text-sm">
                                                                No Item Added
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <td className="text-black text-sm font-medium py-2 px-2 text-right" colSpan={8}>Grand Total</td>
                                                        <td className="text-black text-sm font-medium py-2 px-2 text-right">{calculateGrandTotal()}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="w-full">
                                            {this.state.cartItems.length > 0 && 
                                            <button className="w-full hover:bg-green-600 text-white p-3 bg-green-500 rounded text-sm" onClick={() => this.saveTransaction()}>Submit Transaction</button>}
                                        </div>
                                    </div>
                                
                                    {/* Product Modal */}
                                    <div className={`fixed z-10 inset-0 overflow-y-scroll ${this.state.showProductModal ? 'block' : 'hidden'} transition-all duration-150`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="flex flex-col md:col-span-2">
                                                        <label className="text-xs">Product <b className="text-red-400 font-normal">*</b></label>
                                                        <Select className="text-sm" isClearable={true} placeholder="Select product ..." options={this.state.productList} maxMenuHeight={100} value={this.state.selectableProductValue} onChange={val => this.onProductSelected(val)} />
                                                    </div>
                                                    {
                                                        <div className="flex flex-col">
                                                            <label className="text-xs">Price</label>
                                                            Rp. {this.state.selectedProduct.product.price_per_unit_retail ? numeral(this.state.selectedProduct.product.price_per_unit_retail).format('0,0.[00]') : 0} /&nbsp;
                                                            {this.state.selectedProduct.product.unit ? this.state.selectedProduct.product.unit : "Unit"}
                                                        </div>
                                                    }
                                                    <div className="flex flex-col">
                                                        <label className="text-xs">Stock</label>
                                                        <b>
                                                            {
                                                                this.state.selectedProduct.product.stock ? this.state.selectedProduct.product.is_unlimited ? "Unlimited" : this.state.selectedProduct.product.stock : this.state.selectedProduct.product.is_unlimited ? "Unlimited" : 0
                                                            } {this.state.selectedProduct.product.unit ? this.state.selectedProduct.product.is_unlimited ? "" : this.state.selectedProduct.product.unit : "Unit"}
                                                        </b>
                                                    </div>
                                                    <div className="flex flex-col md:col-span-2">
                                                        <label className="text-xs">Quantity</label>
                                                        <input type="text" pattern="[0-9]*" value={this.state.selectedProduct.quantity ? numeral(this.state.selectedProduct.quantity).value() : 0} className="p-2 text-sm border border-gray-300 rounded mt-1" onChange={ev => {
                                                            if(this.state.selectedProduct.product){
                                                                return this.setState({
                                                                    selectedProduct: {
                                                                        ...this.state.selectedProduct, quantity: (ev.target.value > this.state.selectedProduct.product.stock) && !this.state.selectedProduct.product.is_unlimited ? this.state.selectedProduct.product.stock : numeral(ev.target.value).value()
                                                                    }
                                                                })
                                                            }
                                                        }}></input>
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
                            <TransactionList />
                        </div>
                    </section>
                </div>
            </>
        )
    }
}

export default Transaction