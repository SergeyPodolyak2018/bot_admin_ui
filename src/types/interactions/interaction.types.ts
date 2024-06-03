import { BotShort } from 'types/bots';
import { UserShort } from 'types/user';

export type Interaction = {
  id: number | string;
  botId: string | number;
  startTimestamp: string;
  finishTimestamp: string;
  sentiment: string;
  description: string;
  topics: string;
  keywords: string;
  uri: string;
  type: 'voice_chat' | 'text_chat' | 'twilio_chat';
  done: boolean;
  orgName: string;
  botName: string;
  duration: number;
  countMessages: number;
  audioMsInOneChunk: number;
  audioWaveform: string;
  bot: BotShort;
  browserName: string;
  os: string;
  ipAddress: string;
  country: string;
  state: string;
  zip: string;
  phoneNumber: string;
  userId: string;
  user?: UserShort;
  city: string;
  summary: string;
  result: string | null;
};

export type InteractionMessage = {
  id: string | number;
  interactionId: string | number;
  startTimestamp: string;
  finishTimestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative' | '';
  description: string;
  uri: string;
  content: string;
  type: 'question' | 'answer';
  topics?: string;
  keywords?: string;
};

export type Sentiments = {
  positive: number;
  neutral: number;
  negative: number;
};

export interface InteractionFilterWithSearch extends Interaction {
  search: string;
  orgId: string;
}

export type InteractionFields = keyof InteractionFilterWithSearch;

export type InteractionsFilter = {
  orgName: string[];
  botName: string[];
  type: string[];
  done: string[];
  sentiment: string[];
  country: string[];
};
