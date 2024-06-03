import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { SPACE_NAME } from './global.constants.ts';
import { GlobalState } from './global.types.ts';

export const selectState = (state: RootState) => state[SPACE_NAME] as GlobalState;

export const selectLoaderCount = createSelector(selectState, (state) => state.loaderCount);

export const selectShowLoading = createSelector(selectLoaderCount, (count) => count > 0);

export const selectNotifications = createSelector(selectState, (state) => state.notifications);
export const selectDevice = createSelector(selectState, (state) => state.device);
export const isSideMenuOpen = createSelector(selectState, (state) => state.sideMenuState);
