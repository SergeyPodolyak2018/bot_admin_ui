export type PaymentCard = {
  brand: 'visa' | 'mastercard';
  checks: PaymentCardChecks;
  country: string;
  display_brand: 'visa' | 'mastercard';
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string; //"credit"
  generated_from: null;
  last4: string;
};

export type PaymentCardNetworks = {
  available: string[]; // 'visa'
  preferred: null;
};

export type PaymentCardChecks = {
  address_line1_check: null | 'pass';
  address_postal_code_check: null | 'pass';
  cvc_check: null | 'pass';
};

export type PaymentMethodsData = {
  card: PaymentCard;
  networks: PaymentCardNetworks;
  three_d_secure_usage: {
    supported: boolean;
  };
  wallet: null;
  created: number;
  customer: string;
  id: string;
  livemode: boolean;
  metadata: object;
  object: string; // 'payment_method'
  radar_options: object;
  type: 'card';
};

export type BillingHistory = {
  id: string; //"pi_3MtwBwLkdIwHu7ix28a3tqPa"
  object: string; //"payment_intent"
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip: any;
  };
  amount_received: number;
  application: null;
  application_fee_amount: null;
  automatic_payment_methods: {
    enabled: boolean;
  };
  canceled_at: null;
  cancellation_reason: null;
  capture_method: string; //"automatic"
  client_secret: string; //"pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH"
  confirmation_method: string; //"automatic"
  created: number;
  currency: string; //"usd"
  customer: null;
  description: null;
  invoice: null;
  last_payment_error: null;
  latest_charge: null;
  livemode: false;
  metadata: any;
  next_action: null;
  on_behalf_of: null;
  payment_method: null;
  payment_method_options: {
    card: {
      installments: null;
      mandate_options: null;
      network: null;
      request_three_d_secure: string; //"automatic"
    };
    link: {
      persistent_token: null;
    };
  };
  payment_method_types: string[];
  processing: null;
  receipt_email: null;
  review: null;
  setup_future_usage: null;
  shipping: null;
  source: null;
  statement_descriptor: null;
  statement_descriptor_suffix: null;
  status: string; //"requires_payment_method"
  transfer_data: null;
  transfer_group: null;
};
