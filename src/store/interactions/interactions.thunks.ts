import { getCountries, getInteractions } from 'services/api';
import { createAppAsyncThunk } from 'store/store.hooks';
import { InteractionFields, FilterRule, Order } from 'types';

type Filter = {
  key: InteractionFields;
  value?: (string | number)[];
  rule: FilterRule;
};

type GetInteractionsArgs = {
  filter: Filter[];
  sortField: InteractionFields;
  sortOrder: Order;
  page: number;
  size: number;
};

export const fetchInteractions = createAppAsyncThunk('user/fetchInteractions', async (args: GetInteractionsArgs) => {
  const res = await getInteractions(args);
  return res.data;
});

export const fetchCountries = createAppAsyncThunk('user/fetchCountries', async () => {
  const res = await getCountries();
  return res.data;
});
