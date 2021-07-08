import React from 'react'
import { ItemModalContext } from '../context/itemModalContext'
import { Select, InputNumber } from 'antd'

const { Option } = Select

const ItemModal = () => {
  const [selectedProduct, setSelectedProduct] = React.useState({})
  const [qty, setQty] = React.useState(0)
  const context = React.useContext(ItemModalContext)
  let currentCart = context.cart

  const onSelect = data => {
    const selectedProduct = context.product.filter(product => {
      return product.id === data
    })

    setQty(1)
    return setSelectedProduct(selectedProduct[0])
  }

  const closeModal = () => {
    context.setIsOpen(false)
    setSelectedProduct({})
    setQty(0)
  }

  return (<div className={`${context.isOpen ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-y-scroll block transition-all duration-150`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Barang <b className="text-red-400 font-normal">*</b></label>
                <Select
                  showSearch
                  // style={{ width: 200 }}
                  value={selectedProduct ? selectedProduct.id : null}
                  placeholder="Pilih barang"
                  optionFilterProp="children"
                  onChange={onSelect}
                  className='w-full'
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    context.product.map(product => {
                      return <Option key={product.id} value={product.id}>{product.name}</Option>
                    })
                  }
                </Select>
                {/* <Select className="text-sm" isClearable={true} placeholder="Select product ..." options={products} maxMenuHeight={100} /> */}
              </div>
              <div className="flex flex-col">
                <label className="text-xs">Satuan</label>
                <b>
                  {selectedProduct.unit ? selectedProduct.unit : <b className='font-bold text-gray-200 cursor-not-allowed'>Tidak Tersedia</b>}
                </b>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Kuantitas</label>
                <InputNumber className='w-full' min={1} value={qty} onChange={value => setQty(value)} disabled={!selectedProduct.unit} />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type='button' onClick={() => {
              const existingCart = currentCart.map(cart => {
                return cart.details.id
              })
              
              if(existingCart.includes(selectedProduct.id)){
                currentCart = currentCart.map(cart => {
                  if(cart.details.id === selectedProduct.id){
                    const newQty = cart.qty + qty
                    
                    cart.qty=newQty
                  }

                  return cart
                })
              }else{
                currentCart = [...currentCart, {
                  key: selectedProduct.id,
                  details: selectedProduct,
                  qty: qty
                }]
              }
              
              
              context.setCart(currentCart)
              closeModal()
            }} className={`${selectedProduct.id ? 'block' : 'hidden'} w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm bg-green-500 hover:bg-green-700`}>
              Tambah
            </button>
            <button type="button" onClick={() => {
              closeModal()
            }} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
          </div>
        </div>
    </div>)
}

export default ItemModal