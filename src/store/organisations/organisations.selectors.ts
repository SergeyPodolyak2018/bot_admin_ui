import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store.types';

export const selectOrganisationsState = (state: RootState) => state.organisations;

export const selectOrganisations = createSelector(selectOrganisationsState, (state) => state.data);
export const selectOrganisationsLoader = createSelector(selectOrganisationsState, (state) => state.loading);
export const selectOrganisationsIsUploaded = createSelector(selectOrganisationsState, (state) => state.uploaded);
