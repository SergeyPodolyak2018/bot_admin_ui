import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { BILLING_URL, CHANGE_BILLING_PLAN } from './billing.constants';
import { ChangeBillingPlanArgs, GetBillingPlansRes } from './billing.types';

export const getBillingPlans = (): Promise<AxiosResponse<GetBillingPlansRes>> => {
  return axiosInstance.get(BILLING_URL, {});
};

export const changePlan = (data: ChangeBillingPlanArgs): Promise<AxiosResponse> => {
  return axiosInstance.post(CHANGE_BILLING_PLAN, data);
};
