import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store.types';

export const selectUserState = (state: RootState) => state.user;

export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);

export const selectExpertMode = createSelector(selectUserState, (state) => !!state.data?.expertMode);

export const selectUserAuth = createSelector(selectUserState, (state) => state.auth);

export const selectUser = createSelector(selectUserState, (state) => state.data);

export const selectUserError = createSelector(selectUserState, (state) => state.error);
export const selectOrg = createSelector(selectUserState, (state) => state.organization);
export const selectOrgData = (state: RootState) => {
  const selected = state.user.organization;
  const organizations = state.organisations.data;
  if (!selected || !organizations) return undefined;

  return organizations.find((org) => String(org.id) === String(selected.value));
};
