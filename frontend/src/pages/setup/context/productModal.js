import React from 'react';

export const ProductModalContext = React.createContext()

export const ProductModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [openCreator, setOpenCreator] = React.useState(false)
  const [product, setProduct] = React.useState({})

  return (
    <ProductModalContext.Provider value={{
      isOpen, 
      setIsOpen,
      openCreator,
      setOpenCreator,
      product,
      setProduct
    }}>
      {children}
    </ProductModalContext.Provider>
  )
}