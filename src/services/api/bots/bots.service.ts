import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { BOTS_URL } from './bots.constants';
import { GetBotByIdResponse, GetBotResponse, GetBotsResponse } from './bots.types';

export const getBots = (): Promise<AxiosResponse<GetBotsResponse>> => {
  return axiosInstance.get(BOTS_URL, {});
};
export const postBot = (data: Partial<FormData>): Promise<AxiosResponse<GetBotResponse>> => {
  return axiosInstance.post(BOTS_URL, data, {
    headers: { 'content-type': `multipart/form-data; boundary=${data}` },
  });
};

export const updateBot = (data: Partial<FormData>, botId: string | number): Promise<AxiosResponse<GetBotResponse>> => {
  return axiosInstance.put(`${BOTS_URL}/${botId}`, data, {
    headers: { 'content-type': `multipart/form-data; boundary=${data}` },
  });
};

export const fetchBotById = (botId: number): Promise<AxiosResponse<GetBotByIdResponse>> => {
  return axiosInstance.get(`${BOTS_URL}/${botId}`, {});
};

export const fetchBotByIdString = (botId: string): Promise<AxiosResponse<GetBotByIdResponse>> => {
  return axiosInstance.get(`${BOTS_URL}/${botId}`, {});
};

export const removeBot = (id: number): Promise<AxiosResponse> => {
  return axiosInstance.delete(`${BOTS_URL}/${id}`, {});
};
