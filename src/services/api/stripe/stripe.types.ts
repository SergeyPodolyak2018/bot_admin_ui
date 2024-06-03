import { PaymentMethodsData } from 'types';

export type CreatePaymentPayload = {
  amount: string;
  customerId: string;
  metadata: {
    userId: number;
    last4: string;
    organizationId: number | string;
  };
};

export type GetBillingHistoryPayload = {
  customerId: string;
};

export type CreatePaymentResponse = { client_secret: string; next_action: any };

export type GetPaymentMethodsResponse = PaymentMethodsData[];
