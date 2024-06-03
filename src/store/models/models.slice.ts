import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialModelsState } from './constants';
import { GetModelsResponse } from 'services/api/models/models.types';

export const modelsSlice = createSlice({
  name: 'models',
  initialState: initialModelsState,
  reducers: {
    setModels: (state, action: PayloadAction<GetModelsResponse>) => {
      state.models = action.payload;
    },
  },
});

export const { setModels } = modelsSlice.actions;
export const modelsReducer = modelsSlice.reducer;
