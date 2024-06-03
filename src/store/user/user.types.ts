import { SerializedError } from '@reduxjs/toolkit';
import { IOption } from 'components/common';
import { User } from 'types/user';

export type UserState = {
  data: User | null;
  organization: IOption | null;
  auth: boolean;
  loading: boolean;
  error: SerializedError | null;
};
