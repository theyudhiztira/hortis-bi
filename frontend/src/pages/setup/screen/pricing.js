import React from 'react'
import DataTable from 'react-data-table-component'
import PricingModal from '../components/pricingModal'
import { PricingModalContext } from '../context/pricingModal'
import handler from '../handler'

const Pricing = () => {
  const [product, setProduct] = React.useState([])
  const context = React.useContext(PricingModalContext)

  const openModal = (product) => {
    context.setProduct(product)
    context.setIsOpen(true)  
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const [result, error] = await handler.fetchProduct()

      if(error){
        return alert('Terjadi masalah silahkan hubungi developer!')
      }

      let productData = []
      result.map(product => {
        const editButton = (<button className='btn bg-yellow-400 p-2 rounded' onClick={() => openModal(product)}>Atur Harga</button>)
        return productData = [...productData, {
          id: product.id,
          name: product.name,
          category: product.category_details.name,
          sub_category: product.sub_category_details.name,
          action: editButton
        }]
      })

      setProduct(productData)
    }

    fetchData()
  }, [])

  return (<React.Fragment>
    <div className='w-full'>
      <div className='w-full'>
        <DataTable
          search
          className='w-full'
          data={product}
          columns={[
            {
              name: "ID",
              selector: (row) => row['id'],
              sortable: true,
              width: '9%'
            },
            {
              name: "Produk",
              selector: (row) => row['name'],
              sortable: true
            },
            {
              name: "Kategori",
              selector: (row) => row['category'],
              sortable: true
            },
            {
              name: "Sub-Kategori",
              selector: (row) => row['sub_category'],
              sortable: true
            },
            {
              name: "Aksi",
              selector: (row) => row['action']
            }
          ]}
          noHeader
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
        />
      </div>
    </div>
    <PricingModal />
  </React.Fragment>)
}

export default Pricing