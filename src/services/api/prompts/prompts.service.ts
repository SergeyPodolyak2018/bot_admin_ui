import { AxiosResponse } from 'axios';
import { getAPIBaseUri, getMainPath } from 'config';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { BOT_PROMPTS, PROMPT } from './prompts.constants';
import { GetPromptPayload, PostPromptPayload } from './prompts.types';

export const getPrompts = (): Promise<AxiosResponse<GetPromptPayload[]>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${PROMPT}`, {});
};

export const getPromptsByBotId = (botId: number | string): Promise<AxiosResponse<GetPromptPayload[]>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${BOT_PROMPTS}/${botId}`, {});
};
export const getPromptById = (id: number): Promise<AxiosResponse<GetPromptPayload>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${PROMPT}/${id}`, {});
};
export const putPromptById = (
  id: number,
  data: Partial<GetPromptPayload>,
): Promise<AxiosResponse<GetPromptPayload>> => {
  return axiosInstance.put(`${getAPIBaseUri()}${getMainPath()}${PROMPT}/${id}`, data, {});
};
export const deletePromptById = (id: number): Promise<AxiosResponse<GetPromptPayload>> => {
  return axiosInstance.delete(`${getAPIBaseUri()}${getMainPath()}${PROMPT}/${id}`, {});
};

export const postPrompt = (data: Partial<PostPromptPayload>): Promise<AxiosResponse<GetPromptPayload>> => {
  return axiosInstance.post(`${getAPIBaseUri()}${getMainPath()}${PROMPT}`, data, {});
};
