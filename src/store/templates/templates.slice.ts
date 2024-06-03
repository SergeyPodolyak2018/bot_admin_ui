import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialUserState } from './constants.ts';
import { fetchTemplateTypes, fetchTemplates } from './templates.thunks.ts';

export const templatesSlice = createSlice({
  name: 'templates',
  initialState: initialUserState,
  reducers: {
    setCategories: (state, action: PayloadAction<any[]>) => {
      state.categories = action.payload;
    },
    setTemplates: (state, action: PayloadAction<any[]>) => {
      state.templates = action.payload;
    },
    setTemplate: (state, action: PayloadAction<any>) => {
      const index = state.templates.findIndex((x: any) => x.id === action.payload.id);
      if (index != -1) {
        state.templates[index] = { ...state.templates[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTemplateTypes.pending, (state) => {
      state.loadingTypes = true;
    });
    builder.addCase(fetchTemplateTypes.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loadingTypes = false;
    });
    builder.addCase(fetchTemplateTypes.rejected, (state) => {
      state.categories = [];
      state.loadingTypes = false;
    });
    builder.addCase(fetchTemplates.pending, (state) => {
      state.loadingTemplates = true;
    });
    builder.addCase(fetchTemplates.fulfilled, (state, action) => {
      state.templates = action.payload;
      state.loadingTemplates = false;
    });
    builder.addCase(fetchTemplates.rejected, (state) => {
      state.templates = [];
      state.loadingTemplates = false;
    });
  },
});

export const { setTemplates, setTemplate } = templatesSlice.actions;
export const templatesReducer = templatesSlice.reducer;
