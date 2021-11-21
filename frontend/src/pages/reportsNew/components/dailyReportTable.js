import React, {useState} from 'react'
import numeral from 'numeral'

const DailyReportTable = (props) => {
  const parseHeader = () => {
    const result = props.header.map(v => {
      return <th style={{
        minWidth: 120
      }}>{v}</th>
    })
    
    return result
  }

  const parseTable = () => {
    const result = props.datatable.map(v => {
      let row = <tr>
        <td>{v.label}</td>
        {v.data.map(data => {
          return <td>{numeral(data).format('0,0.[00]')}</td>
        })}
      </tr>
      return row
    })

    return result
  }
  
  return (<table>
    <thead className='w-full'>
      <tr>
        <th style={{ minWidth: 140 }}>Produk</th>
        { parseHeader() }
      </tr>
    </thead>
    <tbody>
      { parseTable() }
    </tbody>
  </table>)
}

export default DailyReportTable