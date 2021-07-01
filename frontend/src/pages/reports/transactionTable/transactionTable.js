import numeral from 'numeral';
import React from 'react';

const ItemTable = (props) => {
  return (
    <table className='table w-full'>
      <tbody>
        {Object.keys(props.data).map((row) => {
          return (<React.Fragment key={row}>
            <tr className='bg-gray-300'>
              <td className='p-2'><b className='font-bold'>{row}</b></td>
              <td className='p-2 text-right'><b className='font-semibold'>Quantity</b></td>
              <td className='p-2 text-right'><b className='font-semibold'>Revenue</b></td>
            </tr>
            {
              (props.data[row]).map((item, index) => {
                return (
                  <tr className='hover:bg-gray-100' key={`${row}-${index}`}>
                    <td className='p-2'>{`${Object.keys(item)}`}</td>
                    <td className='p-2 text-right'>{item[Object.keys(item)].quantity}</td>
                    <td className='p-2 text-right'>{numeral(item[Object.keys(item)].income).format('0,0')}</td>
                  </tr>
                )
              })
            }
          </React.Fragment>)
        })}
      </tbody>
    </table>
  )
}

const CategoryTable = (props) => {
  return (
    <table className='table w-full'>
      <tbody>
        {Object.keys(props.data).map((row) => {
          return (<React.Fragment key={row}>
            <tr className='bg-gray-300'>
              <td className='p-2'><b className='font-bold'>{row}</b></td>
              <td className='p-2 text-right'><b className='font-semibold'>Quantity</b></td>
              <td className='p-2 text-right'><b className='font-semibold'>Revenue</b></td>
            </tr>
            {
              (props.data[row]).map((item, index) => {
                return (
                  <tr className='hover:bg-gray-100' key={`${row}-${index}`}>
                    <td className='p-2'>{`${Object.keys(item)} [${item[Object.keys(item)].unit}]`}</td>
                    <td className='p-2 text-right'>{item[Object.keys(item)].quantity}</td>
                    <td className='p-2 text-right'>{numeral(item[Object.keys(item)].income).format('0,0')}</td>
                  </tr>
                )
              })
            }
          </React.Fragment>)
        })}
      </tbody>
    </table>
  )
}

export { ItemTable, CategoryTable }