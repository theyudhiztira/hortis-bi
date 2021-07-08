import React from 'react'
import Navigation from '../../components/navigation'
import ProductionBox from './components/productionBox'
import ProductionTable from './components/productionTable'
import './components/style.css'
import { ItemModalProvider } from './context/itemModalContext'
import { ProductionModalProvider } from './context/productionModalContext'

const Production = () => {
  
  return (<div className="w-full bg-gray-200 h-screen">
    <Navigation isFlex={false} />
    <section className="w-full inline-block p-2 overflow-y-auto md:p-11 md:pl-80">
      <ItemModalProvider>
        <ProductionBox />
      </ItemModalProvider>
      <ProductionModalProvider>
        <ProductionTable />
      </ProductionModalProvider>
    </section>
  </div>)
}

export default Production