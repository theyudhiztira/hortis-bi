import { Modal, Form, Input } from 'antd'
import React from 'react'
import Swal from 'sweetalert2'
import api from '../../../services/apiCaller'
import { PricingModalContext } from '../context/pricingModal'

const PricingModal = () => {
  const context = React.useContext(PricingModalContext)

  const [retail, setRetail] = React.useState(0)
  const [reseller1, setReseller1] = React.useState(0)
  const [reseller2, setReseller2] = React.useState(0)
  const [reseller3, setReseller3] = React.useState(0)
  
  React.useEffect(() => {
    const getProduct = async (id) => {
      try{
        const fetch = await api.get(`product/${id}`)
        const data = fetch.data[0]

        setRetail(data.retail_price)
        setReseller1(data.reseller1_price)
        setReseller2(data.reseller2_price)
        setReseller3(data.reseller3_price)
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
        text: `Apakah anda yakin untuk mengubah harga dari ${context.product.name && context.product.name}`,
        showCancelButton: true
      }).then(async res => {
        if(res.isConfirmed){
          try{
            await api.put(`product/${context.product.id}`, {
              retail_price: retail,
              reseller1_price: reseller1,
              reseller2_price: reseller2,
              reseller3_price: reseller3
            })

            return Swal.fire('Berhasil', 'Harga terbaru telah disimpan', 'success')
            .then(() => {
              return window.location.reload()
            })
          }catch(error){
            return alert('Gagal untuk mengubah harga! Hubungi tim kami!')
          }
        }
      })
    }

    return false
  }


  return (<React.Fragment>
    <Modal
      title={context.product.name}
      centered
      visible={context.isOpen}
      onCancel={() => {
        setRetail(0)
        setReseller1(0)
        setReseller2(0)
        setReseller3(0)
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
            <Input value={context.product.name && context.product.name} disabled />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Kategori">
            <Input value={context.product.name && context.product.category_details.name} disabled />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Sub-Kategori">
            <Input value={context.product.name && context.product.sub_category_details.name} disabled />
          </Form.Item>
        </div>
        <div></div>
        <div>
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
        </div>
      </Form>
    </Modal>
  </React.Fragment>)
  
}

export default PricingModal