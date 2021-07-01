import React, { useState } from 'react';
import Navigation from '../../components/navigation';
import TransactionBox from './components/transactionBox';
import { ProductModalProvider } from './productModalContext';
import { TransactionModalProvider } from './transactionModalContext';
import TransactionTable from './components/transactionTable';

const TransactionNew = () => {

  return (<>
    <div className="w-full bg-gray-200 h-screen">
      <Navigation isFlex={false} />
      <section className="w-full inline-block p-2 overflow-y-auto md:p-11 md:pl-80">
        <ProductModalProvider>
          <TransactionBox />
        </ProductModalProvider>
        <TransactionModalProvider>
          <TransactionTable />
        </TransactionModalProvider>  
      </section>
    </div>
  </>)
}

export default TransactionNew