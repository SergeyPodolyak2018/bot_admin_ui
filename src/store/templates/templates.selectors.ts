import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store.types';

export const selectTemplatesState = (state: RootState) => state.templates;

export const selectCategories = createSelector(selectTemplatesState, (state) => state.categories);
export const selectTemplates = createSelector(selectTemplatesState, (state) => state.templates);
export const selectTemplatesLoader = createSelector(selectTemplatesState, (state) => state.loadingTemplates);
export const selectTemplateTypesLoader = createSelector(selectTemplatesState, (state) => state.loadingTypes);
