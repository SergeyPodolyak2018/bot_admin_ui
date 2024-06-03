import { getTemplates, getTemplatesCategories } from 'services/api';
import { createAppAsyncThunk } from 'store/store.hooks';

export const fetchTemplates = createAppAsyncThunk<any[]>('template/fetchTemplates', async (): Promise<any> => {
  const res = await getTemplates();
  return res.data;
});

export const fetchTemplateTypes = createAppAsyncThunk<any[]>('template/fetchTemplateTypes', async () => {
  const res = await getTemplatesCategories();
  return res.data;
});
