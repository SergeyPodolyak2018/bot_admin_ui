import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import logger from 'utils/logger.ts';
import {
  CHANGE_PASSWORD,
  DEVICE_INFO,
  PING,
  RESET_PASSWORD,
  USER_GOOGL,
  USER_GOOGL_REDIRECT,
  USER_INFO,
  USER_LOGIN,
  USER_LOGOUT,
  USER_SIGN_UP,
  USERS_URL,
} from './user.constants';
import { GetUserInfoResponse, UserLoginPayload, UserLoginResponse, UserRegistrationPayload } from './user.types';

export const getUserInfo = (): Promise<AxiosResponse<GetUserInfoResponse>> => {
  return axiosInstance.get(`${USER_INFO}`);
};

export const login = (payload: UserLoginPayload): Promise<AxiosResponse<UserLoginResponse>> => {
  return axiosInstance.post(`${USER_LOGIN}`, payload);
};

export const signUp = (payload: UserRegistrationPayload): Promise<AxiosResponse<UserLoginResponse>> => {
  return axiosInstance.post(`${USER_SIGN_UP}`, payload);
};
export const logout = (): Promise<AxiosResponse<any>> => {
  return axiosInstance.get(`${USER_LOGOUT}`);
};

export const googleAuth = (): Promise<AxiosResponse<never>> => {
  return axiosInstance.get(`${USER_GOOGL}`);
};
export const googleAuthLink = (): string => {
  return `${USER_GOOGL}`;
};
export const googleAuthRedirect = (): Promise<AxiosResponse<never>> => {
  return axiosInstance.get(`${USER_GOOGL_REDIRECT}`);
};

export const updateUser = (payload: { data: Partial<FormData> }): Promise<AxiosResponse<any>> => {
  const { data } = payload;

  logger.debug('payload', payload);
  return axiosInstance.put(`${USERS_URL}`, data, {
    headers: { 'content-type': `multipart/form-data; boundary=${payload}` },
  });
};

export const ping = () => {
  return axiosInstance.get<unknown, AxiosResponse>(PING);
};

export const getDeviceInfo = () => {
  return axiosInstance.get<unknown, AxiosResponse>(`${DEVICE_INFO}`);
};

export const resetPassword = (email: string): Promise<AxiosResponse<never>> => {
  return axiosInstance.post(`${RESET_PASSWORD}`, { email });
};

export const changePassword = (password: string, code: string): Promise<AxiosResponse<never>> => {
  return axiosInstance.post(`${CHANGE_PASSWORD}`, { code, password });
};
