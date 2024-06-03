import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.types';

export const selectSentimentsState = (state: RootState) => state.sentiments;

export const getFiltersSelector = createSelector(selectSentimentsState, (state) => state.filters);
