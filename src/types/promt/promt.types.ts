export type TPromt = {
  id: number;
  name: string;
  isNoSource: boolean;
  text: string;
  organization: {
    id: number;
    name: string;
  };
};

export type TPromtFields = {
  id: number;
  name: string;
  text: string;
  isNoSource: boolean;
  organization: {
    id: number;
    name: string;
  };
};

export type TPromtPayload = {
  id: string | number;
  name: string;
  text: string;
  isNoSource: boolean;
  botId: string | number;
  organizationId: number;
};
