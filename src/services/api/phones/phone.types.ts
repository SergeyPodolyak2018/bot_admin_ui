import { PhoneNumber } from 'types';

export type GetInvoiceHistory = {
  items: PhoneNumber[];
  count: number;
};

export type BuyPhoneNumberArgs = {
  id?: number;
  phoneNumber: string;
  organizationId: number;
  price: string;
  type: 'tollFree' | 'local';
};

export type AssignPhoneNumberArgs = {
  phone: string;
  recordId: string | number;
};
