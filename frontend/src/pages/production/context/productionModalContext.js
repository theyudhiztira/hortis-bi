import React from 'react';

export const ProductionModalContext = React.createContext()

export const ProductionModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [transaction, setTransaction] = React.useState({})

  return (
    <ProductionModalContext.Provider value={{
      isOpen, 
      setIsOpen,
      transaction,
      setTransaction
    }}>
      {children}
    </ProductionModalContext.Provider>
  )
}