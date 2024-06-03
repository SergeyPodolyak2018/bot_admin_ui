import { CardContent } from 'components/features/BillingPageFeatures/ChangePlanCard/ChangePlanCard.tsx';
import { BillingPlan } from 'types/billing/billing.plan.ts';
import { convertAmount } from 'utils/primitives/number';

export const getBillingPlansContent = (
  plan: BillingPlan,
  onClickSubscribe: (plan: BillingPlan) => void,
): CardContent => {
  if (plan.name === 'free') {
    return {
      title: 'Free plan',
      descriptionTitle: `$${convertAmount(+plan.price)}`,
      description: `Up to ${plan.maxInteractions} interactions`,
      btnText: 'Subscribe',
      onClick: () => onClickSubscribe(plan),
    };
  }
  if (plan.name === 'basic') {
    return {
      title: 'Basic plan',
      descriptionTitle: `$${convertAmount(+plan.price)} / month`,
      description: `For under ${plan.maxInteractions}/month`,
      btnText: 'Subscribe',
      onClick: () => onClickSubscribe(plan),
    };
  }
  if (plan.name === 'business') {
    return {
      title: 'Business plan',
      descriptionTitle: `$${convertAmount(+plan.price)} / month`,
      description: `For ${plan.maxInteractions}/month`,
      btnText: 'Subscribe',
      onClick: () => onClickSubscribe(plan),
    };
  }

  if (plan.name === 'enterprise') {
    return {
      title: 'Enterprise',
      descriptionTitle: `Custom pricing`,
      description: `For 10 000+/month (custom pricing would be common with larger clients)`,
      btnText: 'Subscribe',
      onClick: () => onClickSubscribe(plan),
    };
  }

  return {
    title: plan.name,
    descriptionTitle: `$${convertAmount(+plan.price)} / per month`,
    description: `Up to ${plan.maxInteractions} interactions`,
    btnText: 'Subscribe',
    onClick: () => onClickSubscribe(plan),
  };
};

export const getActiveBillingPlanContent = (
  activePlanId: number,
  plans: BillingPlan[],
  onClickBtn: () => void,
): {
  activePlan: BillingPlan | undefined;
  content: CardContent | undefined;
} => {
  const activePlan = plans.find((plan) => plan.id === activePlanId);
  if (!activePlan) return { activePlan: undefined, content: undefined };

  return { content: { ...getBillingPlansContent(activePlan, onClickBtn), btnText: 'Change plan' }, activePlan };
};
