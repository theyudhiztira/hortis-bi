import React from 'react';

export const PricingModalContext = React.createContext()

export const PricingModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [product, setProduct] = React.useState({})

  return (
    <PricingModalContext.Provider value={{
      isOpen, 
      setIsOpen,
      product,
      setProduct
    }}>
      {children}
    </PricingModalContext.Provider>
  )
}