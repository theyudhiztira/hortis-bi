import React from 'react';

export const MenuContext = React.createContext()

export const MenuContextProvider = ({ children }) => {
  const [menuOpen, setMenuOpen] = React.useState(true)

  return (
    <MenuContextProvider.Provider value={{
      menuOpen
    }}>
      {children}
    </MenuContextProvider.Provider>
  )
}