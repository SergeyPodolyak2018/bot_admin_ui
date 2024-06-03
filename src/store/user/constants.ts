import { UserState } from './user.types';

export const initialUserState: UserState = {
  data: null,
  organization: null,
  auth: false,
  loading: true,
  error: null,
};
