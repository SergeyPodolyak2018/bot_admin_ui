import { getBots, getCategories, getConfig } from 'services/api';
import { createAppAsyncThunk } from 'store/store.hooks';
//import { TBot } from 'types';

export const fetchBots = createAppAsyncThunk('bots/fetchBots', async () => {
  const res = await getBots();
  return res.data;
});

export const fetchCategories = createAppAsyncThunk('bots/fetchCategories', async (botId: number | string) => {
  const res = await getCategories(botId);
  return res.data;
});

export const fetchConfig = createAppAsyncThunk('bots/fetchConfig', async (botId: string | number) => {
  const res = await getConfig(botId);
  return res.data;
});
