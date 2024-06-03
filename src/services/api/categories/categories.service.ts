import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { CATEGORY, CATEGORY_BY_BOT } from './categories.constants.ts';
import { GetCategoryByIDResponse, GetCategoryResponse, putCategoryPayload } from './categories.types.ts';

export const getCategories = (botId: number | string): Promise<AxiosResponse<GetCategoryResponse>> => {
  return axiosInstance.get(`${CATEGORY_BY_BOT}/${botId}`, {});
};

export const getCategorieById = (id: number): Promise<AxiosResponse<GetCategoryByIDResponse>> => {
  return axiosInstance.get(`${CATEGORY}/${id}`, {});
};

export const putCategore = (
  catId: number,
  data: Partial<putCategoryPayload>,
): Promise<AxiosResponse<GetCategoryResponse>> => {
  return axiosInstance.put(`${CATEGORY}/${catId}`, data, {});
};
export const deleteCategore = (catId: number): Promise<AxiosResponse<GetCategoryResponse>> => {
  return axiosInstance.delete(`${CATEGORY}/${catId}`, {});
};

export const postCategore = (data: Partial<putCategoryPayload>): Promise<AxiosResponse<GetCategoryByIDResponse>> => {
  return axiosInstance.post(`${CATEGORY}`, data, {});
};
