import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { initialState, SPACE_NAME } from './global.constants.ts';
import { decLoaderCountReducer, incLoaderCountReducer } from './global.reducers.ts';
import { AddNotificationArgs } from './global.types.ts';

const slice = createSlice({
  name: SPACE_NAME,
  initialState,
  reducers: {
    incLoaderCountAction: incLoaderCountReducer,
    decLoaderCountAction: decLoaderCountReducer,
    addNotification: (state, action: PayloadAction<AddNotificationArgs>) => {
      const id = v4();
      state.notifications.push({ ...action.payload, id });
    },
    removeNotificationById: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((item) => item.id !== action.payload);
    },
    setDeviceInfo: (state, action: PayloadAction<any>) => {
      state.device = action.payload;
    },
    setSideMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.sideMenuState = action.payload;
    },
  },
  extraReducers: () => {},
});

export const {
  reducer,
  actions: {
    setDeviceInfo,
    incLoaderCountAction,
    decLoaderCountAction,
    removeNotificationById,
    addNotification,
    setSideMenuOpen,
  },
} = slice;
