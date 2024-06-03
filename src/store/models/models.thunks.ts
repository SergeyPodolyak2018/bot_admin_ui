import { getModelsInfo } from 'services/api/models/models.service';
import { createAppAsyncThunk } from 'store/store.hooks';
import { Model } from 'types/models';

export const fetchModels = createAppAsyncThunk<Model[]>('user/fetchModels', async () => {
  const res = await getModelsInfo();
  return res.data;
});
