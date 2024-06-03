import { AxiosResponse } from 'axios';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { STATS_URL } from './dashboard.constants.ts';
import {
  IRequestTotalInteraction,
  IRequestInteractionInterval,
  IResponseTotalInteraction,
  IResponseInteractionInterval,
  IResponseSentiments,
  IResponseTopBots,
  IRequestTopBots,
  IResponseLocations,
  IResponseCount,
  IRequestNegativeInteraction,
} from './dashboard.types.ts';
import { getTimezoneOffset } from '../../../utils/primitives/date/index.ts';

export const getTotalInteraction = (
  payload: IRequestTotalInteraction,
): Promise<AxiosResponse<IResponseTotalInteraction>> => {
  return axiosInstance.post(`${STATS_URL}/total-interactions`, payload);
};

export const getInteractionByInterval = (
  payload: IRequestInteractionInterval,
): Promise<AxiosResponse<IResponseInteractionInterval[]>> => {
  return axiosInstance.post(`${STATS_URL}/interactions-by-interval`, { ...payload, tz: getTimezoneOffset() });
};

export const getSentiments = (payload: IRequestTotalInteraction): Promise<AxiosResponse<IResponseSentiments[]>> => {
  return axiosInstance.post(`${STATS_URL}/sentiment`, payload);
};

export const getTopBots = (payload: IRequestTopBots): Promise<AxiosResponse<IResponseTopBots[]>> => {
  return axiosInstance.post(`${STATS_URL}/top-bots`, payload);
};

export const getLocations = (payload: IRequestTopBots): Promise<AxiosResponse<IResponseLocations[]>> => {
  return axiosInstance.post(`${STATS_URL}/location`, payload);
};

export const getCountInteractions = (payload: IRequestTotalInteraction): Promise<AxiosResponse<IResponseCount>> => {
  return axiosInstance.post(`${STATS_URL}/count`, payload);
};

export const getNegativeInteractions = (payload: IRequestNegativeInteraction): Promise<AxiosResponse<any>> => {
  return axiosInstance.post(`${STATS_URL}/negative`, payload);
};
