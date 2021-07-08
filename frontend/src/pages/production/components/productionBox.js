import React from 'react'
import { DatePicker } from 'antd'
import { ItemModalContext } from '../context/itemModalContext'
import { Select } from 'antd'
import './style.css'
import ItemModal from './itemModal'
import {handlers} from '../handler'
import { IoTrash } from 'react-icons/io5'
import Swal from 'sweetalert2'

const { Option } = Select
  
const ProductionBox = () => {
  // eslint-disable-next-line
  const [date, setDate] = React.useState('')
  const [supplier, setSupplier] = React.useState({})
  const [selectedSupplier, setSelectedSupplier] = React.useState(0)
  const context = React.useContext(ItemModalContext)

  React.useEffect(() => {
    const fetchProducts = async () => {
      const [result, error] = await handlers.fetchProducts()

      if(error){
        console.log(error)
        return alert('Terjadi masalah silahkan hubungi team support kami.')
      }

      context.setProduct(result)
    }

    const fetchCustomer = async () => {
      const [result, error] = await handlers.getCustomer()

      if(error){
        alert('Terjadi masalah silahkan hubungi team support kami.')
      }

      setSupplier(result)
    }

    fetchProducts()
    fetchCustomer()
    // eslint-disable-next-line
  }, [])


  const removeItem = index => {
    const newCart = context.cart.filter((cart, cartIndex) => {return index !== cartIndex}).map(cart => {
      return cart
    })

    return context.setCart(newCart)
  }

  const onSupplierSelected = data => {
    return setSelectedSupplier(data)
  }

  const sendData = async () => {
    if(date === ''){
      return Swal.fire('Data Tidak Lengkap!', 'Tanggal tidak boleh kosong!', 'error')
    }

    if(selectedSupplier === 0){
      return Swal.fire('Data Tidak Lengkap!', 'Supplier tidak boleh kosong!', 'error')
    }

    return Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Pastikan data yang anda masukan sudah benar! Anda tidak dapat merubah data setelah 24 jam!',
        showCancelButton: true,
        cancelButtonText: 'Cek kembali'
    }).then(async res => {
      if(res.isConfirmed){
        const [result, error] = await handlers.sendDataToServer(date, context.cart, selectedSupplier)

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
  
  return (<div className='bg-white grid grid-cols-4 rounded-md shadow-md p-5 gap-3'>
        <h1 className="text-2xl col-span-4">Catat Produksi</h1>
        <DatePicker dateFormat="yyyy-MM-dd" className="border border-gray-300 rounded px-3 text-sm standard-input-height ring-offset-blue-700 col-span-4" placeholder='Pilih tanggal' onChange={(val) => setDate(val.format('YYYY-MM-DD'))} />
        <Select
          showSearch
          value={selectedSupplier ? selectedSupplier : null}
          className='w-full col-span-4 standard-input-height'
          placeholder='Pilih Supplier'
          optionFilterProp='children'
          onChange={onSupplierSelected}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            supplier.length > 0 &&
            supplier.map(supplier => {
              return <Option key={supplier.id} value={supplier.id}>{supplier.full_name}</Option>
            })
          }
        </Select>
        <div className='col-span-4 grid grid-cols-2 gap-3'>
          <div className='flex ant-row-space-between col-span-2' style={{alignItems: 'center'}}>
            <h4 className='text-md bold mt-2 mb-0'>Data Produksi</h4>
            <button className="bg-green-500 rounded-md px-3 py-2 text-white" onClick={() => {
              context.setIsOpen(true)
            }}>+ Tambah Barang</button>
          </div>
        </div>
        <div className='col-span-4 mt-3'>
            <table className='w-full'>
              <thead className='bg-gray-500'>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Unit</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  context.cart.map((cart, index) => {
                    return (<tr key={index}>
                    <td>{cart.details.name}</td>
                    <td>{cart.details.category_details.name}</td>
                    <td>{cart.details.unit}</td>
                    <td>{cart.qty}</td>
                    <td className='text-center'><IoTrash onClick={() => removeItem(index)} className='m-auto text-red-700 cursor-pointer' title='Delete' style={{
                      width: 25,
                      height: 25
                    }} /></td>
                  </tr>)
                  })
                }
                {
                  context.cart.length < 1 && <tr>
                    <td colSpan={5}><b className='text-red-500'>Transaksi Kosong</b></td>
                  </tr>
                }
              </tbody>
            </table>
            <div className='col-span-2 mt-2'>
              <button onClick={() => sendData()} className={`btn ant-btn-block rounded p-2 shadow-md text-white font-bold ${context.cart.length < 1 ? 'cursor-not-allowed bg-gray-400' : 'bg-green-400'}`} disabled={context.cart.length < 1}>Simpan Transaksi</button>
            </div>
          </div>
          <ItemModal />
      </div>)
}

export default ProductionBox