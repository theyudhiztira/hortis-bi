import React from 'react'
import { TransactionModalContext } from '../transactionModalContext'
import moment from 'moment'
import numeral from 'numeral'
import './style.css'
import Swal from 'sweetalert2'
import { handlers } from '../handler'

const TransactionDetailsModal = () => {
  const context = React.useContext(TransactionModalContext)
  const transaction = context.transaction

  const checkTime = (time) => {
    var currentTime = moment();
    var timeStore = moment(time);
    
    return currentTime.diff(timeStore, 'h');
  }

  const removeTransaction = (id) => {
    return Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Apakah anda yakin untuk menghapus transaksi?',
        showCancelButton: true,
        cancelButtonText: 'Cek kembali'
    }).then(async res => {
      if(res.isConfirmed){
        const [result, error] = await handlers.deleteDataFromServer(id)
        if(!result){
          return Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: error.response.data.message
          })
        }

        Swal.fire('Selesai', 'Data berhasil di hapus', 'success').then(() => {
          return window.location.reload()
        })
      }
    })
  }

  return (<div className={`${context.isOpen ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-y-scroll block transition-all duration-150`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-full md:w-2/5">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col col-span-2">
                <label className="text-xs">ID Transaksi</label>
                <div>{transaction.id}</div>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Tanggal Transaksi</label>
                <div>{moment(transaction.date).format('YYYY-MM-DD')}</div>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Tanggal Pencatatan</label>
                <div>{moment(transaction.created_at).format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Total</label>
                <div>Rp. {numeral(transaction.amount_due).format('0,0.[0000]')}</div>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Operator</label>
                <div>{transaction.creator_details.full_name}</div>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs">Detail Transaksi</label>
                <div className='w-full'>
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-gray-500'>
                        <th className='text-center'>Produk</th>
                        <th className='text-center'>Harga</th>
                        <th className='text-center'>Tipe Harga</th>
                        <th className='text-center'>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transaction.items.map(item => {
                          return (<tr>
                            <td>{item.product_details.name}</td>
                            <td>Rp. {numeral(item.price).format('0,0.[0000]')}</td>
                            <td>{numeral(item.pricing_type).format('0,0.[0000]')}</td>
                            <td>{item.quantity}</td>
                          </tr>)
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {
              checkTime(transaction.createdAt) <= 0 ? <button type='button' onClick={() => removeTransaction(transaction.id)} className={`block w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm bg-red-500 hover:bg-red-700`}>
                Hapus
              </button> : ""
            }
            <button type="button" onClick={() => {
              context.setIsOpen(false)
            }} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
          </div>
        </div>
    </div>)
}

export default TransactionDetailsModal