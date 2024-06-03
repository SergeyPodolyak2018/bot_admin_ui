import { PHONE_NUMBER_STATUS } from '..';

export type PhoneNumber = {
  id: number;
  phoneNumber: string;
  sid: string;
  price: string;
  paymentDate: string;
  type: 'local' | 'tollFree';
  status: PHONE_NUMBER_STATUS;
  organizationId: number;
  botId: number | null;
  bot?: { id: string; name: string; recordId: number };
};

export type Country = {
  countryCode: string;
  country: string;
};
