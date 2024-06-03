import { BillingPlan } from 'types/billing/billing.plan.ts';

export type GetBillingPlansRes = BillingPlan[];
export type ChangeBillingPlanArgs = {
  id: number;
  organizationId: number;
};
