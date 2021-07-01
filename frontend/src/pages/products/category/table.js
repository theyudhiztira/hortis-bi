import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import handlers from './table.handler'
import moment from 'moment'
import Pagination from '@material-ui/lab/Pagination'

const CategoriesTable = (props) => {
  const [tableData, setTableData] = useState({})
  const [from, setFrom] = useState(new Date)
  const [to, setTo] = useState(new Date)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (from, to, page, limit) => {
    const getData = await handlers.loadTableData(from, to, page, limit)
    
    if(!getData.status){
      return Swal.fire('Oops..', 'Failed to load data! Please contact support.', 'error')
    }

    return setTableData(getData.data)
  }

  const parseTable = () => {
    let result = []
    let number = 1

    tableData.data.map(data => {
      result = [...result, (<tr key={data.id} className={number % 2 ? 'cursor-pointer hover:bg-gray-100' : 'bg-gray-200 hover:bg-gray-100 cursor-pointer'}>
        <td className='text-sm text-center p-2'>{data.id}</td>
        <td className='text-sm text-center p-2'>{data.name}</td>
        <td className='text-sm text-center p-2'>{data.creator_name}</td>
        <td className='text-sm text-center p-2'>{moment(data.created_at).format('YYYY-MM-DD HH:mm')}</td>
      </tr>)]

      return number++
    })

    return result
  }

  return (
    <div className="mx-auto grid grid-cols-2 gap-4 bg-white rounded-xl p-3 shadow-sm mt-3">
      <div className='col-span-2 flex flex-col'>
        <h3 className='font-semibold'>Category List</h3>
      </div>
      <div className="flex flex-col col-span-2 overflow-x-auto">
        <table style={{
          minWidth: '475px'
        }}>
          <thead>
            <tr className='bg-gray-300'>
              <th className='font-semibold text-sm p-2 text-center'>ID</th>
              <th className='font-semibold text-sm p-2 text-center'>Category Name</th>
              <th className='font-semibold text-sm p-2 text-center'>Created By</th>
              <th className='font-semibold text-sm p-2 text-center'>Created At</th>
            </tr>
          </thead>
          <tbody>
            {!Object.keys(tableData).length ? (<tr>
              <td colSpan={4} className='text-center font-semibold text-md text-gray-400'>Loading...</td>
            </tr>) : parseTable()}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col col-span-2">
        {
          Object.keys(tableData).length && <Pagination count={tableData.totalPages} shape="rounded" variant="outlined" color="primary" onChange={(ev, page) => fetchData('', '', page, 5)} />
        }
        {/* <button className='p-3 bg-green-500 hover:bg-green-600 transition duration-300 text-white font-semibold tracking-wide text-sm rounded' onClick={async () => await sendDataToServer(categoryName)}>Submit</button> */}
      </div>
    </div>
  )
}

export default CategoriesTable