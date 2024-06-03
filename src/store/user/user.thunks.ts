import { getUserInfo } from 'services/api';
import { createAppAsyncThunk } from 'store/store.hooks';
import { User } from 'types';

export const fetchUser = createAppAsyncThunk<User>('user/fetchUser', async () => {
  const res = await getUserInfo();
  return res.data;
});
