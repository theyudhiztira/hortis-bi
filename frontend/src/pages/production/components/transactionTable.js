import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { handlers } from '../handler'
import './style.css'
import { IoEye } from 'react-icons/io5'
import Pagination from '@material-ui/lab/Pagination'
import TransactionDetailsModal from './transactionDetailsModal'
import { TransactionModalContext } from '../transactionModalContext'

const TransactionTable = () => {
  const date = useState(null)
  const [data, setData] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const context = React.useContext(TransactionModalContext)

  useEffect(() => {
    const dataFetcher = async () => {
      const [result, error] = await handlers.loadTransactionData(null, null, 10, currentPage, date)

      if(error){
        return alert('Ada masalah silahkan hubungi tim kami.')
      }

      setData(result.data)
      setTotalPage(result.totalPages)
      setCurrentPage(result.currentPage)
    }

    dataFetcher()
  }, [currentPage, date])

  const viewTransaction = async (id) => {
    const [result, error] = await handlers.fetchTransaction(id)

    if(error){
      return alert('Terjadi kesalahan pada sistem silahkan hubungi team kami. TT43-FETCH')
    }

    context.setTransaction(result)
    context.setIsOpen(true)
  }

  return (
    <React.Fragment>
      <div className='bg-white grid grid-cols-4 rounded-md shadow-md p-5 gap-3 mt-5'>
        <h1 className="text-2xl col-span-4">Daftar Transaksi</h1>
        
        <div className='col-span-4 grid grid-cols-2 gap-3'>
          {/* <div className='col-span-2 justify-end'>
            <DatePicker placeholder='Pilih tanggal' className='right-0' onChange={(date) => {
              if(date){
                setDate(date.format('YYYY-MM-DD'))
              }
            }} />
          </div> */}
          <div className='col-span-2 mt-2 overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-500'>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Total (Rp.)</th>
                  <th>Tanggal</th>
                  <th>Operator</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map(dt => {
                    return (<tr key={dt.id}>
                      <td>{dt.id}</td>
                      <td>Rp. {numeral(dt.amount_due).format('0,0')}</td>
                      <td>{moment(dt.created_at).format('YYYY-MM-DD HH:mm')}</td>
                      <td>{dt.full_name}</td>
                      <td><IoEye className='m-auto text-2xl cursor-pointer text-green-500' onClick={() => viewTransaction(dt.id)}  /></td>
                      {/* <td>{ checkTime(dt.created_at) > 0 ? '-' : <IoEye className='m-auto text-2xl cursor-pointer text-green-500'  /> }</td> */}
                    </tr>)
                  })
                }
                {
                  data.length < 1 && <tr><td colSpan={5}><b className='font-bold text-red-500'>Transaksi Kosong</b></td></tr>
                }
              </tbody>
            </table>
          </div>
          <div className='col-span-2 mt-2'>
            <Pagination count={totalPage} shape="rounded" variant="outlined" color="primary" onChange={(ev, page) => setCurrentPage(page)} />
          </div>
        </div>
      </div>
      {context.transaction.id && <TransactionDetailsModal />}
    </React.Fragment>
  )
}

export default TransactionTable