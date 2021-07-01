import React, { useEffect, useState } from 'react'
import { DatePicker } from 'antd'
import { ItemAddModal } from './itemAddModal'
import moment from 'moment'
import {handlers} from '../handler'
import { ProductModalContext } from '../productModalContext'
import './style.css'
import numeral from 'numeral'
import { IoTrash } from 'react-icons/io5'
import Swal from 'sweetalert2'

const TransactionBox = () => {
  const [date, setDate] = useState('')
  const [customerType, setCustomerType] = useState('RETAIL')
  const [cartItem, setCartItem] = useState([])
  const context = React.useContext(ProductModalContext)

  useEffect(() => {
    const fetchProducts = async () => {
      const [result, error] = await handlers.fetchProducts()

      if(error){
        alert('Terjadi masalah silahkan hubungi team support kami.')
      }
      
      context.setProduct(result)  
    }

    fetchProducts()
  }, [])

  const removeItem = index => {
    const newCart = context.cart.filter((cart, cartIndex) => {return index !== cartIndex}).map(cart => {
      return cart
    })

    return context.setCart(newCart)
  }
  
  const sendData = async () => {
    if(date.length < 10){
      return Swal.fire('Oops..', 'Pilih tanggal untuk melanjutkan!', 'error')
    }

    return Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Pastikan data yang anda masukan sudah benar! Anda tidak dapat merubah data setelah 24 jam!',
        showCancelButton: true,
        cancelButtonText: 'Cek kembali'
    }).then(async res => {
      if(res.isConfirmed){
        const [result, error] = await handlers.sendDataToServer(date, context.cart)
        if(!result){
          return Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: error.response.data.message
          })
        }

        Swal.fire('Selesai', 'Data berhasil di simpan', 'success').then(() => {
          return window.location.reload()
        })
      }
    })
    
    
  }

  return (
    <React.Fragment>
      <div className='bg-white grid grid-cols-4 rounded-md shadow-md p-5 gap-3'>
        <h1 className="text-2xl col-span-4">Buat Transaksi</h1>
        <DatePicker dateFormat="yyyy-MM-dd" className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 col-span-4" placeholder='Pilih tanggal' onChange={(val) => setDate(val.format('YYYY-MM-DD'))} />
        <div className='col-span-4 grid grid-cols-2 gap-3'>
          <div className='flex ant-row-space-between col-span-2' style={{alignItems: 'center'}}>
            <h4 className='text-md bold mt-2 mb-0'>Data Transaksi</h4>
            <button className="bg-green-500 rounded-md px-3 py-2 text-white" onClick={() => {
              context.setIsOpen(true)
            }}>+ Tambah Barang</button>
          </div>
          <div className='col-span-2 mt-3 overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-500'>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Tipe Harga</th>
                  <th>Unit</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  context.cart.map((cart, index) => {
                    return (<tr key={index}>
                    <td>{cart.details.name}</td>
                    <td>{cart.details.category_details.name}</td>
                    <td>Rp. {numeral(cart.price).format('0,0')}</td>
                    <td>{cart.priceGroup}</td>
                    <td>{cart.details.unit}</td>
                    <td>{cart.qty}</td>
                    <td>Rp. {numeral(cart.price * cart.qty).format('0,0')}</td>
                    <td className='text-center'><IoTrash onClick={() => removeItem(index)} className='m-auto text-red-700 cursor-pointer' title='Delete' style={{
                      width: 25,
                      height: 25
                    }} /></td>
                  </tr>)
                  })
                }
                {
                  context.cart.length < 1 && <tr>
                    <td colSpan={8}><b className='text-red-500'>Transaksi Kosong</b></td>
                  </tr>
                }
                <tr>
                  <td colSpan={7} className='text-right font-bold'>Grand Total</td>
                  <td className='font-bold'>
                    Rp. {
                      numeral(context.cart.map(cart => {
                        const subTotal = cart.price * cart.qty
                        return +subTotal
                      }).reduce((firstValue, secondValue) => firstValue + secondValue, 0)).format('0,0')
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='col-span-2'>
            <button onClick={() => sendData()} className={`btn ant-btn-block rounded p-2 shadow-md text-white font-bold ${context.cart.length < 1 ? 'cursor-not-allowed bg-gray-400' : 'bg-green-400'}`} disabled={context.cart.length < 1}>Simpan Transaksi</button>
          </div>
        </div>
        <ItemAddModal />
      </div>
    </React.Fragment>
  )
}

export default TransactionBox