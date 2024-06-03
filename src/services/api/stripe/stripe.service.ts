import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import {
  CREATE_PAYMENT,
  CUSTOMER,
  GET_BILLING_HISTORY,
  GET_PAYMENT_METHODS,
  SAVE_PAYMENT_METHOD,
} from './stripe.constants.ts';
import {
  CreatePaymentPayload,
  CreatePaymentResponse,
  GetBillingHistoryPayload,
  GetPaymentMethodsResponse,
} from './stripe.types.ts';
import { BillingHistory } from 'types';

export const getPaymentMethods = (id: string) => {
  return axiosInstance.get<any, AxiosResponse<GetPaymentMethodsResponse>>(`${GET_PAYMENT_METHODS}/${id}`);
};

export const createCustomer = (data: { name: string; email: string; userId: number }): Promise<AxiosResponse> => {
  return axiosInstance.post(CUSTOMER, data);
};

export const savePaymentMethod = (data: { pmId: string; customerId: string }): Promise<AxiosResponse> => {
  return axiosInstance.post(SAVE_PAYMENT_METHOD, data);
};

export const createPayment = (payload: CreatePaymentPayload): Promise<AxiosResponse<CreatePaymentResponse>> => {
  return axiosInstance.post(CREATE_PAYMENT, {
    paymentMethodType: 'card',
    currency: 'usd',
    ...payload,
  });
};

export const getBillingHistory = (data: GetBillingHistoryPayload) => {
  return axiosInstance.post<GetBillingHistoryPayload, AxiosResponse<BillingHistory[]>>(`${GET_BILLING_HISTORY}`, data);
};
