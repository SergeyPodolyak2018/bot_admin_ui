import { AxiosResponse } from 'axios';
import { DemoBot } from 'types';
import { apiAxiosInstance } from 'utils/axios';
import { GET_DEMO_BOTS, GET_DEMO_STATUS } from './demo.constants.ts';
import { DEMO_STATUS } from './demo.types.ts';

export const getDemoBots = () => {
  return apiAxiosInstance.get<any, AxiosResponse<DemoBot[]>>(`${GET_DEMO_BOTS}`);
};

export const getDemoStatus = () => {
  return apiAxiosInstance.get<any, AxiosResponse<DEMO_STATUS>>(`${GET_DEMO_STATUS}`);
};
