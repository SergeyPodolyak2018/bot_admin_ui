import { AxiosResponse } from 'axios';
import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { ORGANISATIONS, ORGANISATIONS_ASSIGN_USER } from './organizations.constants';
import {
  GetOrganisationsResponse,
  PostOrganisationAssignUserPayload,
  PostOrganisationPayload,
  PostOrganisationResponse,
  PutOrganizationResponse,
} from './organizations.types';

export const getOrganisations = (): Promise<AxiosResponse<GetOrganisationsResponse>> => {
  return axiosInstance.get(`${ORGANISATIONS}`, {});
};

export const getOrganisationById = (id: number): Promise<AxiosResponse<any>> => {
  return axiosInstance.get(`${ORGANISATIONS}/${id}`, {});
};

export const removeOrganisation = (id: number): Promise<AxiosResponse> => {
  return axiosInstance.delete(`${ORGANISATIONS}/${id}`, {});
};

export const postOrganisation = (
  payload: PostOrganisationPayload,
): Promise<AxiosResponse<PostOrganisationResponse>> => {
  return axiosInstance.post(`${ORGANISATIONS}`, payload, {});
};
export const putOrganisation = (
  data: Partial<PostOrganisationPayload>,
  id: number,
): Promise<AxiosResponse<PutOrganizationResponse>> => {
  return axiosInstance.put(`${ORGANISATIONS}/${id}`, data, {});
};

export const postOrganisationAssignUser = (
  id: number,
  payload: PostOrganisationAssignUserPayload,
): Promise<AxiosResponse<never>> => {
  return axiosInstance.post(`${ORGANISATIONS_ASSIGN_USER}/${id}`, payload, {});
};
