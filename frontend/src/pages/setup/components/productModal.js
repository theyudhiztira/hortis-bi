import { Modal, Form, Input, Select} from 'antd'
import React from 'react'
import Swal from 'sweetalert2'
import api from '../../../services/apiCaller'
import { ProductModalContext } from '../context/productModal'

const ProductModal = () => {
  const context = React.useContext(ProductModalContext)

  const defaultValue = {
    value: '',
    text: ''
  }

  const [subCatList, setSubCatList] = React.useState([])
  const [catList, setCatList] = React.useState([])

  const [category, setCategory] = React.useState(defaultValue)
  const [subCategory, setSubCategory] = React.useState(defaultValue)
  const [name, setName] = React.useState('')
  const [unit, setUnit] = React.useState(defaultValue)
  
  React.useEffect(() => {
    const getProduct = async (id) => {
      try{
        const fetch = await api.get(`product/${id}`)
        const data = fetch.data[0]

        setCategory({value: data.category_id, text: data.category})
        setSubCategory({value: data.sub_category_id, text: data.sub_category})
        setName(data.name)
        setUnit({value: data.unit, text: data.unit})
      }catch(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }
    }

    context.product.id && getProduct(context.product.id)
  }, [context.product])

  const saveData = async () => {
    if(context.product.name){
      return Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: `Apakah anda yakin untuk mengubah data dari ${context.product.name && context.product.name}`,
        showCancelButton: true
      }).then(async res => {
        if(res.isConfirmed){
          try{
            await api.put(`product/${context.product.id}`, {
              name: name,
              unit: unit.text,
              sub_category_id: subCategory.value,
              category_id: category.value
            })

            return Swal.fire('Berhasil', 'Data produk telah disimpan', 'success')
            .then(() => {
              return window.location.reload()
            })
          }catch(error){
            return alert('Gagal untuk menyimpan data produk! Hubungi tim kami!')
          }
        }
      })
    }

    return false
  }

  const prepareData = async () => {
    await (['product-category', 'product-sub-category']).map(async url => {
      try{
        const fetch = await api.get(`${url}`)
        const data = fetch.data.data

        if(url === 'product-category'){
          setCatList(data)
        }else{
          setSubCatList(data)
        }
      }catch(error){
        return alert('Ada masalah silahkan hubungi team kami!')
      }
    })
  }

  const handleSearch = async (url, terms) => {
    try{
      const fetch = await api.get(`${url}?terms=${terms}`)
      const data = fetch.data.data

      if(url === 'product-category'){
        setCatList(data)
      }else{
        setSubCatList(data)
      }
    }catch(error){
      return alert('Ada masalah silahkan hubungi team kami!')
    }
  }

  const categoryOptions = catList.map(d => <Select.Option key={d.id}>{d.name}</Select.Option>)
  const subCategoryOptions = subCatList.map(d => <Select.Option key={d.id}>{d.name}</Select.Option>)
  const unitOptions = (['Pcs','Kg','Porsi','Ltr','Unit','Pkk','Zak','Set','Org','Lot','Btl']).map(value => <Select.Option key={value}>{value}</Select.Option>)

  return (<React.Fragment>
    <Modal
      title={context.product.name}
      centered
      visible={context.isOpen}
      onCancel={() => {
        context.setIsOpen(false)
        context.setProduct({})
      }}
      cancelText="Batalkan"
      okText="Simpan"
      onOk={() => saveData()}
    >
      <Form
        layout="vertical"
        className='grid grid-cols-1 gap-2 md:grid-cols-2'
      >
        <div>
          <Form.Item label="Nama Produk">
            <Input value={name} defaultValue={name} onChange={(el) => setName(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Kategori">
            <Select
              showSearch
              value={category.text}
              // placeholder={this.props.placeholder}
              // style={this.props.style}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={(terms) => handleSearch('product-category' ,terms)}
              onChange={(value, data) => setCategory({text: data.children, value: value})}
              notFoundContent={null}
              onFocus={prepareData}
            >
              {
                categoryOptions
              }
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Sub-Kategori">
            <Select
              showSearch
              value={subCategory.text}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={(terms) => handleSearch('product-sub-category' ,terms)}
              onChange={(value, data) => setSubCategory({text: data.children, value: value})}
              notFoundContent={null}
              onFocus={prepareData}
            >
              {
                subCategoryOptions
              }
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Unit">
            <Select
              value={unit.text}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onChange={(value, data) => setUnit({text: data.children, value: value})}
              notFoundContent={null}
            >
              {
                unitOptions
              }
            </Select>
          </Form.Item>
        </div>
        {/* <div>
          <Form.Item required label="Harga Outlet">
            <Input defaultValue={context.product.name && context.product.retail_price} value={retail} onChange={(el) => setRetail(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item required label="Harga Reseller 1">
            <Input defaultValue={context.product.name && context.product.reseller1_price} value={reseller1} onChange={(el) => setReseller1(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item required label="Harga Reseller 2">
            <Input defaultValue={context.product.name && context.product.reseller2_price} value={reseller2} onChange={(el) => setReseller2(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item required label="Harga Reseller 3">
            <Input defaultValue={context.product.name && context.product.reseller3_price} value={reseller3} onChange={(el) => setReseller3(el.target.value)} required />
          </Form.Item>
        </div> */}
      </Form>
    </Modal>
  </React.Fragment>)
  
}

export default ProductModal