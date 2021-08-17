import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { handlers } from '../handler'
import './style.css'
// import TransactionDetailsModal from './transactionDetailsModal'
import { ProductionModalContext } from '../context/productionModalContext'
import ProductionDetailsModal from './productionDetailsModal'
import DataTable from 'react-data-table-component'


const ProductionTable = () => {
  //eslint-disable-next-line
  const [date, setDate] = useState(null)
  const [data, setData] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const context = React.useContext(ProductionModalContext)

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
        <h1 className="text-2xl col-span-4">Daftar Produksi</h1>
        
        <div className='col-span-4 grid grid-cols-2 gap-3'>
          
          <div className='col-span-2 mt-2 overflow-x-auto'>
            <DataTable
              className='w-full'
              data={data}
              pagination
              striped
              highlightOnHover
              pointerOnHover
              onRowClicked={(row) => viewTransaction(row.id)}
              columns={[
                {
                  name: "Prod. ID",
                  selector: (row) => row['id'],
                  sortable: true,
                  width: '10%',
                  center: true
                },
                {
                  name: "Supplier",
                  selector: (row) => row['supplier_name'],
                  sortable: true,
                  center: true
                },
                {
                  name: "Tanggal",
                  selector: (row) => row['created_at'],
                  format: (row) => moment(row.created_at).format("YYYY-MM-DD"),
                  sortable: true,
                  width: '20%',
                  center: true
                },
                {
                  name: 'Operator',
                  selector: (row) => row['full_name'],
                  sortable: true,
                  center: true
                },

              ]}
            />
          </div>
        </div>
      </div>
      {context.transaction.id && <ProductionDetailsModal />}
    </React.Fragment>
  )
}

export default ProductionTable