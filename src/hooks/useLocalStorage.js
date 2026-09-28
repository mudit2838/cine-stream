'use client';
import { useEffect, useState } from 'react';
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key) || 'null');
      if (Array.isArray(saved))
        setValue(
          saved.filter(
            (movie) =>
              movie &&
              Number.isInteger(movie.id) &&
              typeof movie.title === 'string'
          )
        );
    } catch {
      /* Unavailable or damaged storage: keep in-memory favorites. */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Browsing remains usable. */
    }
  }, [key, value, ready]);
  return [value, setValue, ready];
}
