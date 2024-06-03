import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { CONFIG } from './config.constants';
import { GetConfigResponse } from './config.types';

export const getConfig = (botId: string | number): Promise<AxiosResponse<GetConfigResponse>> => {
  return axiosInstance.get(`${CONFIG}/${botId}`, {});
};
