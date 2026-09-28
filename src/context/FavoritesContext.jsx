'use client';
import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites, ready] = useLocalStorage(
    'cinestream_favorites',
    []
  );

  const addFavorite = useCallback(
    (movie) => {
      if (!movie || !movie.id) return;
      setFavorites((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        return [...prev, movie];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (movieId) => {
      if (!movieId) return;
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (movieId) => {
      if (!movieId) return false;
      return favorites.some((m) => m.id === movieId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (movie) => {
      if (!movie || !movie.id) return;
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        ready,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
