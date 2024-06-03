import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOption } from 'components/common';
import { GetUserInfoResponse } from 'services/api/user/user.types';
import { initialUserState } from './constants';
import { fetchUser } from './user.thunks';

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.auth = action.payload;
    },
    setSelectedOrg: (state, action: PayloadAction<IOption | null>) => {
      state.organization = action.payload;
    },
    setUserData: (state, action: PayloadAction<GetUserInfoResponse>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.auth = true;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.data = null;
      state.auth = false;
      state.error = action.error;
      state.loading = false;
    });
  },
});

export const { setSelectedOrg, setAuthorized, setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
