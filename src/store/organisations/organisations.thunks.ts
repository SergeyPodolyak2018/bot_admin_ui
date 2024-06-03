import { getOrganisations } from 'services/api';
import { decLoaderCountAction, incLoaderCountAction } from 'store/global';
import { createAppAsyncThunk } from 'store/store.hooks';
import { TOrganisation } from 'types';

export const fetchOrganisations = createAppAsyncThunk<TOrganisation[]>(
  'user/fetchOrganisations',
  async (_, { dispatch }) => {
    dispatch(incLoaderCountAction());
    const res = await getOrganisations().finally(() => {
      dispatch(decLoaderCountAction());
    });
    return res.data;
  },
);
