import { useContext } from 'react';
import { CatalogsContext } from "src/contexts/catalogs-context";

export const useCatalogs = () => { 
  const context = useContext(CatalogsContext);
  if (!context) {
    throw new Error('useCatalogs must be inside CatalogsProvider');
  }
  return context;
};