import { createContext } from 'react';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  return <>{children}</>;
}
