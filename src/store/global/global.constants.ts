// import { localStorageGetItem } from 'services';

import { GlobalState } from './global.types';

export const SPACE_NAME = 'global';

export const initialState: GlobalState = {
  error: null,
  loaderCount: 0,
  notifications: [],
  device: null,
  sideMenuState: false,
};
