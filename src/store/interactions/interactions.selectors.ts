import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store.types';

export const selectInteractionsState = (state: RootState) => state.interactions;

export const selectSelectedOption = createSelector(selectInteractionsState, (state) => state.selectedOption);
export const selectSearchStr = createSelector(selectInteractionsState, (state) => state.searchStr);
export const selectFilter = createSelector(selectInteractionsState, (state) => state.filter);

export const selectSortField = createSelector(selectInteractionsState, (state) => state.sortField);
export const selectSortOrder = createSelector(selectInteractionsState, (state) => state.sortOrder);
export const selectPage = createSelector(selectInteractionsState, (state) => state.page);
export const selectPages = createSelector(selectInteractionsState, (state) => state.pages);
export const selectTotalItems = createSelector(selectInteractionsState, (state) => state.totalItems);
export const selectInteractions = createSelector(selectInteractionsState, (state) => state.interactions);
export const selectCountries = createSelector(selectInteractionsState, (state) => state.countries);

export const selectPrevFilter = createSelector(selectInteractionsState, (state) => state.prevFilter);
export const selectInteractionLoading = createSelector(selectInteractionsState, (state) => state.uploaded);
export const selectShowPlaceholder = createSelector(selectInteractionsState, (state) => state.showPlaceholder);
