import { useContext } from 'react';
import { GlobalContext } from './index';

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  return context;
}