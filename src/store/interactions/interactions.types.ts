import { Interaction, Order, InteractionFields, InteractionsFilter, FilterRule } from 'types';

export type TInteractionsData = {
  page: number;
  pages: number;
  totalItems: number;
  interactions: Interaction[];
  prevFilter: string;
  sortOrder: Order;
  sortField: InteractionFields;
  filter: InteractionsFilter;
  filterBufer: InteractionsFilter;
  searchStr: string;
  selectedOption: {
    label: string;
    value: string;
  };
  uploaded: boolean;
  showPlaceholder: boolean;
  countries: string[];
};

type Filter = {
  key: InteractionFields;
  value?: (string | number)[];
  rule: FilterRule;
};

export type GetInteractionsResponse = {
  items: Interaction[];
  page: number;
  size: number;
  totalCount: number;
};

export type GetInteractionsArgs = {
  filter: Filter[];
  sortField: InteractionFields;
  sortOrder: Order;
  page: number;
  size: number;
};
