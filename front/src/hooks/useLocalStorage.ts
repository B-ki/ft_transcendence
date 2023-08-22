import { useState } from 'react';

export function useLocalStorage() {
  const [value, setValue] = useState<string | null>(null);

  const setItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: string): string | null => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
}
