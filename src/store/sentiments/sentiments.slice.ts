import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialSentimentsState } from './constants';

export const sentimentsSlice = createSlice({
  name: 'sentiments',
  initialState: initialSentimentsState,
  reducers: {
    setFilters: (state, action: PayloadAction<string[]>) => {
      state.filters = action.payload;
    },
  },
});

export const { setFilters } = sentimentsSlice.actions;
export const sentimentsReducer = sentimentsSlice.reducer;
