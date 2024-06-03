import { AxiosResponse } from 'axios';
import { AssignPhoneNumberArgs, BuyPhoneNumberArgs, GetInvoiceHistory } from 'services/api/phones/phone.types.ts';
import { Country, PhoneNumber } from 'types';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import {
  ACTIVATE_PHONE_NUMBER,
  ASSIGN_PHONE_NUMBERS,
  AVAILABLE_COUNTRIES,
  BUY_PHONE,
  DELETE_PHONE,
  INVOICE_HISTORY,
  PHONE_NUMBERS,
  PURCHASED_PHONE_NUMBERS,
} from './phone.constants.ts';

export const getAvailableCountries = (): Promise<AxiosResponse<Country[]>> => {
  return axiosInstance.get(`${AVAILABLE_COUNTRIES}`);
};

export const getPhoneNumbers = (countryCode: string): Promise<AxiosResponse<PhoneNumber[]>> => {
  return axiosInstance.get(`${PHONE_NUMBERS}/${countryCode}`);
};

export const getPurchasedPhoneNumbersByOrgId = (id: number): Promise<AxiosResponse<PhoneNumber[]>> => {
  return axiosInstance.get(`${PURCHASED_PHONE_NUMBERS}/${id}`);
};

export const assignPhoneNumber = (payload: AssignPhoneNumberArgs): Promise<AxiosResponse> => {
  return axiosInstance.post(`${ASSIGN_PHONE_NUMBERS}`, payload);
};

export const getInvoiceHistoryByOrgId = (orgId: string): Promise<AxiosResponse<GetInvoiceHistory>> => {
  return axiosInstance.get(`${INVOICE_HISTORY}/${orgId}`);
};

export const buyPhoneNumber = (data: BuyPhoneNumberArgs): Promise<AxiosResponse<PhoneNumber>> => {
  return axiosInstance.post(`${BUY_PHONE}`, data);
};

export const activatePhoneNumber = (phoneNumber: string): Promise<AxiosResponse<PhoneNumber>> => {
  return axiosInstance.post(`${ACTIVATE_PHONE_NUMBER}`, {
    phoneNumber,
  });
};

export const removePhoneNumber = (phoneNumber: string): Promise<AxiosResponse<PhoneNumber>> => {
  return axiosInstance.delete(`${DELETE_PHONE}`, {
    data: {
      phoneNumber,
    },
  });
};
