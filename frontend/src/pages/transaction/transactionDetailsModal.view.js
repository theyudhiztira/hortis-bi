import React from 'react'

const TransactionDetailsModal = (props) => {
    return (
        <div className={`fixed z-10 inset-0 overflow-y-scroll block transition-all duration-150`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-xs">Customer</label>
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
    )
}

export default TransactionDetailsModal