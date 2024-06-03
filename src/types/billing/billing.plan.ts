export type BillingPlan = {
  id: number;
  price: string;
  name: 'free' | 'basic' | 'business' | 'enterprise';
  maxUsers: number;
  maxInteractions: number;
};
