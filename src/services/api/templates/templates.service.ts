import { AxiosResponse } from 'axios';
import { getAPIBaseUri, getMainPath } from '../../../config';

import { apiAxiosInstance as axiosInstance } from '../../../utils/axios';
import {
  CREATE_BOT_BY_TEMPLATE,
  CREATE_TEMPLATE,
  TEMPLATE_DELETE,
  TEMPLATES,
  TEMPLATES_TYPES,
} from './templates.constants';
import {
  GetTemplateByTypeResponse,
  GetTemplateResponse,
  PostCreateCategoryTemplatePayload,
  PostCreateCategoryTemplateResp,
  PostCreateTemplateCategoryFormResp,
  PostCreateTemplateFormPayload,
  PostCreateTemplateFormResp,
  PostEditTemplateFormPayload,
  PostEditTemplateFormResp,
} from './templates.types';

export const getTemplates = (): Promise<AxiosResponse<GetTemplateResponse>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES}`, {});
};

export const getTemplateTypes = (): Promise<AxiosResponse<GetTemplateResponse>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES_TYPES}`, {});
};

export const getTemplatesCategories = (): Promise<AxiosResponse<GetTemplateResponse>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES_TYPES}`, {});
};
export const getTemplatesByType = (id: number): Promise<AxiosResponse<GetTemplateByTypeResponse>> => {
  return axiosInstance.get(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES}/${id}`, {});
};

//Templates
export const editTemplateActive = (id: number, status: boolean): Promise<AxiosResponse<any>> => {
  return axiosInstance.put(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES}/${id}`, { isActive: status });
};

export const removeTemplate = (id: number, organizationId: number): Promise<AxiosResponse<any>> => {
  return axiosInstance.put(`${getAPIBaseUri()}${getMainPath()}${TEMPLATE_DELETE}/${id}`, { organizationId });
};

export const createTemplate = (
  payload: PostCreateTemplateFormPayload,
): Promise<AxiosResponse<PostCreateTemplateFormResp>> => {
  return axiosInstance.post(`${getAPIBaseUri()}${getMainPath()}${CREATE_TEMPLATE}`, payload, {});
};

export const editTemplate = (
  payload: PostEditTemplateFormPayload,
): Promise<AxiosResponse<PostEditTemplateFormResp>> => {
  const { id, typeId, isActive, description } = payload;
  return axiosInstance.put(
    `${getAPIBaseUri()}${getMainPath()}${TEMPLATES}/${id}`,
    { typeId, isActive, description },
    {},
  );
};

// TEMPLATE TYPES
export const createTemplateCategory = (
  payload: Partial<FormData>,
): Promise<AxiosResponse<PostCreateTemplateCategoryFormResp>> => {
  return axiosInstance.post(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES_TYPES}`, payload, {
    headers: { 'content-type': `multipart/form-data; boundary=${payload}` },
  });
};

export const updateTemplateCategory = (payload: {
  id: number;
  data: Partial<FormData>;
}): Promise<AxiosResponse<PostCreateTemplateCategoryFormResp>> => {
  const { id, data } = payload;
  return axiosInstance.put(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES_TYPES}/${id}`, data, {
    headers: { 'content-type': `multipart/form-data; boundary=${payload}` },
  });
};

export const deleteTemplateCategory = (id: number): Promise<AxiosResponse<PostCreateTemplateCategoryFormResp>> => {
  return axiosInstance.delete(`${getAPIBaseUri()}${getMainPath()}${TEMPLATES_TYPES}/${id}`, {});
};

export const createBotByTemplate = (
  payload: PostCreateCategoryTemplatePayload,
): Promise<AxiosResponse<PostCreateCategoryTemplateResp>> => {
  return axiosInstance.post(`${getAPIBaseUri()}${getMainPath()}${CREATE_BOT_BY_TEMPLATE}`, payload, {});
};
