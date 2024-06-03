import { Order } from '../../../types';

export type PERIOD = 'today' | 'week' | 'month';

export interface IRequestTotalInteraction {
  organizationId: number;
  interval: PERIOD;
}

export interface IRequestNegativeInteraction extends IRequestTotalInteraction {
  order: Order;
  page: number;
}

export interface IRequestTopBots extends IRequestTotalInteraction {
  limit: number;
}

export interface IRequestInteractionInterval extends IRequestTotalInteraction {
  interval: PERIOD;
}

export interface IResponseTotalInteraction {
  countVoiceChat: string;
  countTextChat: string;
  countCellChat: string;
}

export interface IResponseInteractionInterval {
  intervalRange: string;
  interactionCount: number;
}
export interface IResponseSentiments {
  count: number;
  sentiment: any;
}

export interface IResponseTopBots {
  uuid: string;
  botName: string;
  interactionsCount: string;
}

export interface IResponseLocations {
  country: string;
  city: string;
  interactionsCount: string;
}

export interface IResponseCount {
  count: number;
}
