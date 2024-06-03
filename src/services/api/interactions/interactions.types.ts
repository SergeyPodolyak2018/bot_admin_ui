import { FilterRule, Interaction, InteractionFields, Order } from 'types';

export type Filter = {
  key: InteractionFields;
  value?: (string | number)[];
  rule: FilterRule;
};

export type GetInteractionsArgs = {
  filter: Filter[];
  sortField: InteractionFields;
  sortOrder: Order;
  page: number;
  size: number;
};

export type BuildUrlArgs = {
  baseURL: string;
} & GetInteractionsArgs;

export type GetInteractionsResponse = {
  items: Interaction[];
  page: number;
  size: number;
  totalCount: number;
};

export type GetInteractionByIdResponse = Interaction;
