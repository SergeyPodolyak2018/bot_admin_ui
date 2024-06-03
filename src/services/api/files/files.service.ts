import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { BOT_FILES, FILES } from './files.constants';
import { GetFileResponse, GetFilesResponse } from './files.types';

export const getFiles = (): Promise<AxiosResponse<GetFilesResponse>> => {
  return axiosInstance.get(`${FILES}`, {});
};

export const fetchFilesByBotId = (botId: number | string): Promise<AxiosResponse<GetFilesResponse>> => {
  return axiosInstance.get(`${BOT_FILES}/${botId}`, {});
};
export const fetchFileById = (id: string | number): Promise<AxiosResponse<GetFileResponse>> => {
  return axiosInstance.get(`${FILES}/${id}`, {});
};

export const postFiles = (data: FormData): Promise<AxiosResponse<GetFileResponse>> => {
  return axiosInstance.post(`${FILES}`, data, {
    headers: { 'content-type': `multipart/form-data; boundary=${data}` },
  });
};

export const putFiles = (data: FormData, id: number): Promise<AxiosResponse<GetFileResponse>> => {
  return axiosInstance.put(`${FILES}/${id}`, data, {
    headers: { 'content-type': `multipart/form-data; boundary=${data}` },
  });
};

export const deleteFiles = (id: number): Promise<AxiosResponse<GetFileResponse>> => {
  return axiosInstance.delete(`${FILES}/${id}`, {});
};
