export const localStorageGetItem = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? (value.match(/^\{|\[/) !== null ? JSON.parse(value) : value) : null;
};

export const localStorageSetItem = <T>(key: string, value: T) => {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
};

export const localStorageRemoveItem = (key: string) => {
  localStorage.removeItem(key);
};

export const localStorageClear = () => {
  localStorage.clear();
};

export const localStorageExists = (key: string): boolean => localStorage.getItem(key) !== null;

export const localStorageGetItemOrSetDefault = <T>(key: string, defaultValue: T): T => {
  if (localStorageExists(key)) {
    return localStorageGetItem(key) as T;
  }
  return defaultValue;
};
