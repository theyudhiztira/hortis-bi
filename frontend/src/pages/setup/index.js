import React from 'react'
import Navigation from '../../components/navigation'
import { Tabs } from 'antd'
import Pricing from './screen/pricing'
import './style.css'
import { PricingModalProvider } from './context/pricingModal'
import { ProductModalProvider } from './context/productModal'
import Product from './screen/product'

const { TabPane } = Tabs

const Setup = () => {
  const [caption, setCaption] = React.useState('Setup Harga')

  return (<div className="w-full bg-gray-200 h-screen">
    <Navigation isFlex={false} />
    <section className="w-full inline-block p-2 overflow-y-auto md:p-11 md:pl-80">
      <div className='bg-white grid grid-cols-4 rounded-md shadow-md p-5 gap-3 mt-5'>
        <h1 className="text-2xl col-span-4">{caption}</h1>
        
        <div className='col-span-4 grid grid-cols-2 gap-3'>
          <Tabs defaultActiveKey="1" type="card" className='col-span-2' onChange={(el) => {
            if(el === '1'){
              setCaption('Pengaturan Harga')
            }else if(el === '2'){
              setCaption('Pengaturan Produk')
            }else if(el === '3'){
              setCaption('Pengaturan Kategori')
            }else if(el === '4'){
              setCaption('Pengaturan Sub-Kategori')
            }
          }}>
            <TabPane tab="Pengaturan Harga" key="1">
              <PricingModalProvider>
                <Pricing />
              </PricingModalProvider>
            </TabPane>
            <TabPane tab="Pengaturan Produk" key="2">
              <ProductModalProvider>
                <Product />
              </ProductModalProvider>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </section>
  </div>)
}

export default Setup