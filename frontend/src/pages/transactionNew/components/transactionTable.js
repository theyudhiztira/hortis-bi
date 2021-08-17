import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { handlers } from '../handler'
import './style.css'
import TransactionDetailsModal from './transactionDetailsModal'
import { TransactionModalContext } from '../transactionModalContext'
import DataTable from 'react-data-table-component'
import { DatePicker } from 'antd'

const TransactionTable = () => {
  //eslint-disable-next-line
  const [date, setDate] = useState(null)
  const [data, setData] = useState([])
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const context = React.useContext(TransactionModalContext)

  useEffect(() => {
    const dataFetcher = async () => {
      const fromDate = from ? moment(from).format('YYYY-MM-DD') : null
      const toDate = to ? moment(to).format('YYYY-MM-DD') : null
      const [result, error] = await handlers.loadTransactionData(fromDate, toDate, 10, currentPage, date)

      if(error){
        return alert('Ada masalah silahkan hubungi tim kami.')
      }

      setData(result.data)
      setTotalPage(result.totalPages)
      setCurrentPage(result.currentPage)
    }

    dataFetcher()
  }, [currentPage, date, from, to])

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
          <div className='col-span-2'>
            <DatePicker
              placeholder='Dari Tanggal'
              dateFormat="yyyy-MM-dd"
              selected={from} 
              onChange={date => setFrom(date)}
              allowClear
            />

            <DatePicker
              placeholder='Sampai Tanggal'
              dateFormat="yyyy-MM-dd"
              style={{
                marginLeft: 15
              }}
              allowClear
              selected={to} 
              onChange={date => setTo(date)}
            />
          </div>
          <div className='col-span-2 mt-2 overflow-x-auto'>
            <DataTable 
              pagination
              striped
              pointerOnHover
              highlightOnHover
              onRowClicked={(row) => viewTransaction(row.id)}
              data={data}
              columns={[
                {
                  name: "ID Transaksi",
                  selector: (row) => row['id'],
                  sortable: true,
                  maxWidth: '13%',
                  center: true
                },
                {
                  name: "Total (Rp.)",
                  selector: (row) => row['amount_due'],
                  format: (row) => "Rp. "+numeral(row.amount_due).format('0,0.[0000]'),
                  sortable: true,
                  center: true
                },
                {
                  name: "Tgl. Transaksi",
                  selector: (row) => row['date'],
                  sortable: true,
                  center: true
                },
                {
                  name: "Tgl. Pencatatan",
                  selector: (row) => row['created_at'],
                  format: (row) => moment(row.created_at).format('YYYY-MM-DD HH:mm'),
                  sortable: true,
                  center: true
                },
                {
                  name: "Operator",
                  selector: (row) => row['full_name'],
                  sortable: true,
                  center: true
                }
              ]}
            />
            
          </div>
        </div>
      </div>
      {context.transaction.id && <TransactionDetailsModal />}
    </React.Fragment>
  )
}

export default TransactionTable