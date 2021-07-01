import React from 'react';

export const TransactionModalContext = React.createContext()

export const TransactionModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [transaction, setTransaction] = React.useState({})

  return (
    <TransactionModalContext.Provider value={{
      isOpen, 
      setIsOpen,
      transaction,
      setTransaction
    }}>
      {children}
    </TransactionModalContext.Provider>
  )
}