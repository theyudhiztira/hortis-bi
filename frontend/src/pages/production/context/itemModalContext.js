import React from 'react';

export const ItemModalContext = React.createContext()

export const ItemModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [product, setProduct] = React.useState([])
  const [cart, setCart] = React.useState([])

  return (
    <ItemModalContext.Provider value={{
      isOpen, 
      setIsOpen,
      product,
      setProduct,
      cart,
      setCart
    }}>
      {children}
    </ItemModalContext.Provider>
  )
}