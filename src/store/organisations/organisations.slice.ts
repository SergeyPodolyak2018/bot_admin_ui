import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrganisation } from 'types';
import { initialUserState } from './constants';
import { fetchOrganisations } from './organisations.thunks';

export const organisationSlice = createSlice({
  name: 'organisations',
  initialState: initialUserState,
  reducers: {
    setOrganisations: (state, action: PayloadAction<TOrganisation[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrganisations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrganisations.fulfilled, (state, action) => {
      state.data = action.payload;
      state.uploaded = true;
      state.loading = false;
    });
    builder.addCase(fetchOrganisations.rejected, (state) => {
      state.data = [];
      state.loading = false;
    });
  },
});

export const { setOrganisations } = organisationSlice.actions;
export const organisationsReducer = organisationSlice.reducer;
