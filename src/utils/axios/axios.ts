import axios from 'axios';
import { getAiUri, getAPIBaseUri, isProductionRuntime } from 'config';
import type { RootStore } from 'store';
import { setAuthorized } from 'store';
import { localStorageGetItem } from '../../services/localStorage.ts';

let store: RootStore;
export const injectStore = (_store: RootStore) => {
  store = _store;
};

export const apiAxiosInstance = axios.create({
  baseURL: getAPIBaseUri(),
  withCredentials: true,
});

apiAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorageGetItem('accessToken');
    if (token !== null && token !== 'null' && !isProductionRuntime()) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(setAuthorized(false));
    }
    return Promise.reject(error);
  },
);

export const aiAxiosInstance = axios.create({
  baseURL: getAiUri(),
  // withCredentials: true,
});
