import { Modal, Form, Input, Select} from 'antd'
import React from 'react'
import Swal from 'sweetalert2'
import api from '../../../services/apiCaller'
import { ProductModalContext } from '../context/productModal'

const ProductCreatorModal = () => {
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

  const [retail, setRetail] = React.useState(0)
  const [reseller1, setReseller1] = React.useState(0)
  const [reseller2, setReseller2] = React.useState(0)
  const [reseller3, setReseller3] = React.useState(0)
  
  React.useEffect(() => {
    prepareData()
  }, [])

  const saveData = async () => {
    return Swal.fire({
      icon: 'warning',
      title: 'Perhatian',
      text: `Apakah anda yakin untuk menambahkan ${name} ke dalam database?`,
      showCancelButton: true
    }).then(async res => {
      if(name.length < 1){
        return Swal.fire('Data Tidak Lengkap', 'Nama Produk di butuhkan!', 'error')
      }else if(category.text.length < 1){
        return Swal.fire('Data Tidak Lengkap', 'Kategori Produk di butuhkan!', 'error')
      }else if(subCategory.text.length < 1){
        return Swal.fire('Data Tidak Lengkap', 'Sub-Kategori Produk tidak boleh kosong!', 'error')
      }else if(unit.text.length < 1){
        return Swal.fire('Data Tidak Lengkap', 'Unit dari Produk tidak boleh kosong!', 'error')
      }

      if(res.isConfirmed){
        console.log({
          retail_price: retail
        })

        const dataToSend = {
          name: name,
          unit: unit.text,
          sub_category_id: subCategory.value,
          category_id: category.value,
          retail_price: retail,
          reseller1_price: reseller1,
          reseller2_price: reseller2,
          reseller3_price: reseller3
        }

        console.log(dataToSend)
        
        try{
          await api.post(`product`, dataToSend)

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
  const unitOptions = (['Pcs','Kg','Ltr','Unit','Pkk','Zak','Set','Org','Lot','Btl','Porsi']).map(value => <Select.Option key={value}>{value}</Select.Option>)

  return (<React.Fragment>
    <Modal
      title='Tambah Produk'
      centered
      visible={context.openCreator}
      onCancel={() => {
        context.setOpenCreator(false)
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
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={(terms) => handleSearch('product-category' ,terms)}
              onChange={(value, data) => setCategory({text: data.children, value: value})}
              notFoundContent={null}
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
        <div>
          <Form.Item required label="Harga Outlet">
            <Input defaultValue={0} value={retail} onChange={(el) => setRetail(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item required label="Harga Reseller 1">
            <Input defaultValue={0} value={reseller1} onChange={(el) => setReseller1(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item required label="Harga Reseller 2">
            <Input defaultValue={0} value={reseller2} onChange={(el) => setReseller2(el.target.value)} required />
          </Form.Item>
        </div>
        <div>
          <Form.Item required label="Harga Reseller 3">
            <Input defaultValue={0} value={reseller3} onChange={(el) => setReseller3(el.target.value)} required />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  </React.Fragment>)
  
}

export default ProductCreatorModal