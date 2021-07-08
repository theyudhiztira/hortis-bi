import React from 'react'
import Navigation from '../../components/navigation'
import { Tabs } from 'antd'
import Pricing from './screen/pricing'
import './style.css'
import { PricingModalProvider } from './context/pricingModal'

const { TabPane } = Tabs

const Setup = () => {
  return (<div className="w-full bg-gray-200 h-screen">
    <Navigation isFlex={false} />
    <section className="w-full inline-block p-2 overflow-y-auto md:p-11 md:pl-80">
      <div className='bg-white grid grid-cols-4 rounded-md shadow-md p-5 gap-3 mt-5'>
        <h1 className="text-2xl col-span-4">Daftar Produk</h1>
        
        <div className='col-span-4 grid grid-cols-2 gap-3'>
          <div className='col-span-2'>
            <PricingModalProvider>
              <Pricing />
            </PricingModalProvider>
          </div>
          {/* <Tabs defaultActiveKey="1" type="card" className='col-span-2'>
            <TabPane tab="Pengaturan Harga" key="1">
              
            </TabPane>
            <TabPane tab="Pengaturan Produk" key="2">
              Content of card tab 2
            </TabPane>
          </Tabs> */}
        </div>
      </div>
    </section>
  </div>)
}

export default Setup