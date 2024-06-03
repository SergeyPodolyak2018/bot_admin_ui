import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store.types';

export const selectModelsState = (state: RootState) => state.models;

export const selectModels = createSelector(selectModelsState, (state) => state.models);
