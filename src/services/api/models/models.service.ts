import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { GET_MODELS } from './models.constants';
import { GetModelsResponse } from './models.types';

export const getModelsInfo = (): Promise<AxiosResponse<GetModelsResponse>> => {
  return axiosInstance.get(`${GET_MODELS}`);
};
