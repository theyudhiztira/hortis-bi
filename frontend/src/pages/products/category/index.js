import React, { useState } from 'react'
import Swal from 'sweetalert2'
import handlers from './handler'
import CategoriesTable from './table'

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState('')
  const [refreshTable, setRefreshTable] = useState(false)

  const sendDataToServer = async () => {
    return Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'You won\'t be able to revert it! Are you sure?',
        showCancelButton: true,
    }).then(async res => {
      if(res.isConfirmed){
        const sendData = await handlers.sendDataToServer(categoryName)
        if(!sendData.status){
          return Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: sendData.error.response.data.errors[0]
            })
        }

        Swal.fire('Nice', 'Data has been saved', 'success')
        setRefreshTable(refreshTable)
        setRefreshTable(true)
        setCategoryName('')
        return setRefreshTable(false)
      }
    })
  }

  return (
    <>
      <div className="mx-auto grid grid-cols-2 gap-4 bg-white rounded-xl p-3 shadow-sm">
        <div className='col-span-2 flex flex-col'>
          <h3 className='font-semibold'>Category Creator</h3>
        </div>
        <div className="flex flex-col col-span-2">
          <label className="text-xs">Category Name <b className="text-red-400 font-normal">*</b></label>
          <input type="text" placeholder="Customer Name" className="p-2 text-sm border border-gray-300 rounded mt-1" value={categoryName} name="newCustomerName" onChange={(el) => setCategoryName(el.target.value)} />
        </div>
        <div className="flex flex-col col-span-2">
          <button className='p-3 bg-green-500 hover:bg-green-600 transition duration-300 text-white font-semibold tracking-wide text-sm rounded' onClick={async () => await sendDataToServer(categoryName)}>Submit</button>
        </div>
      </div>
      <CategoriesTable />
    </>
  );
}

export default CategoryManager