import React from 'react';

export const ProductModalContext = React.createContext()

export const ProductModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [product, setProduct] = React.useState([])
  const [cart, setCart] = React.useState([])

  return (
    <ProductModalContext.Provider value={{
      isOpen, 
      setIsOpen,
      product,
      setProduct,
      cart,
      setCart
    }}>
      {children}
    </ProductModalContext.Provider>
  )
}