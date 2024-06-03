import { Action, ThunkAction } from '@reduxjs/toolkit';
import { store } from './store';
import { BaseStateStatusT } from './store.constants';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type RootStore = typeof store;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

type BaseError = string | null | undefined;

export type BaseState<T, K = BaseError> = {
  data: T;
  status: BaseStateStatusT;
  error: K;
};
