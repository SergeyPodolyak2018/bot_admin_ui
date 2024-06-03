import { GlobalState } from './global.types';

export const incLoaderCountReducer = (state: GlobalState) => {
  state.loaderCount += 1;
};

export const decLoaderCountReducer = (state: GlobalState) => {
  state.loaderCount -= 1;
};
