import { ChangePlanCard } from 'components/features/BillingPageFeatures/ChangePlanCard/ChangePlanCard.tsx';
import { FC } from 'react';
import { changePlan } from 'services';
import {
  addNotification,
  decLoaderCountAction,
  incLoaderCountAction,
  selectOrg,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { BillingPlan } from 'types/billing/billing.plan.ts';
import logger from 'utils/logger.ts';
import s from './BillingPlans.module.scss';
import { getBillingPlansContent } from './BillingPlans.utils';

export type BillingPlansProps = {
  billingPlans: BillingPlan[];
  activePlan: BillingPlan;
  onUpdate: () => void;
};
export const BillingPlans: FC<BillingPlansProps> = ({ billingPlans, activePlan, onUpdate }) => {
  const dispatch = useAppDispatch();
  const selectedOrg = useAppSelector(selectOrg);
  const handleClickChangePlan = async (plan: BillingPlan) => {
    if (!selectedOrg) return;
    if (plan.name === 'enterprise') return;

    dispatch(incLoaderCountAction());
    await changePlan({
      id: plan.id,
      organizationId: +selectedOrg.value,
    })
      .then(() => {
        onUpdate();
      })
      .catch((err) => {
        logger.error('Change plan error', err);
        dispatch(addNotification({ type: 'error', title: 'Error', message: 'Change plan error' }));
      })
      .finally(() => {
        dispatch(decLoaderCountAction());
      });
  };

  return (
    <div className={s.cards}>
      {billingPlans.map((plan) => (
        <ChangePlanCard
          active={activePlan.id === plan.id}
          key={plan.id}
          content={getBillingPlansContent(plan, handleClickChangePlan)}
        />
      ))}
    </div>
  );
};
