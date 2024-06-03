import { AxiosResponse } from 'axios';
import { InteractionMessage } from 'types';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { INTERACTIONS_MESSAGES, INTERACTIONS_URL } from './interactions.constants.ts';
import { GetInteractionByIdResponse, GetInteractionsArgs, GetInteractionsResponse } from './interactions.types.ts';
import { buildUrl } from './interactions.utils.ts';

export const getInteractions = (args: GetInteractionsArgs): Promise<AxiosResponse<GetInteractionsResponse>> => {
  return axiosInstance.get(
    buildUrl({
      baseURL: INTERACTIONS_URL,
      ...args,
    }),
  );
};
export const getInteractionById = (id: string | number): Promise<AxiosResponse<GetInteractionByIdResponse>> => {
  return axiosInstance.get(`${INTERACTIONS_URL}/${id}`);
};

export const getCountries = (): Promise<AxiosResponse<string[]>> => {
  return axiosInstance.get(`${INTERACTIONS_URL}/countries`);
};

export const getMessagesByInteractionId = (id: string | number): Promise<AxiosResponse<InteractionMessage[]>> => {
  return axiosInstance.get(`${INTERACTIONS_URL}/${id}${INTERACTIONS_MESSAGES}`);
};
