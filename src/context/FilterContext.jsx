import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [selectedIsland, setSelectedIsland] = useState('Semua Wilayah');

  const islands = [
    'Sumatera',
    'Jawa',
    'Bali-Nusa Tenggara',
    'Kalimantan',
    'Sulawesi',
    'Maluku',
    'Papua'
  ];

  return (
    <FilterContext.Provider value={{ selectedIsland, setSelectedIsland, islands }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
