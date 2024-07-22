import React, { createContext, useState, useContext } from 'react';

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('home');

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  return (
    <PageContext.Provider value={{ activePage, handleNavigation }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  return useContext(PageContext);
};
