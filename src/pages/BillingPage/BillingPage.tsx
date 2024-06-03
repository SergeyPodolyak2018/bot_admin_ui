import { Button, Loader } from 'components/common';
import {
  AddPaymentCardForm,
  BillingHistory,
  CardContent,
  ChangePlanCard,
  PaymentCard,
  PaymentForm,
} from 'components/features';
import { getActiveBillingPlanContent } from 'components/features/BillingPageFeatures/BillingPlans';
import { BillingPlans } from 'components/features/BillingPageFeatures/BillingPlans/BillingPlans.tsx';
import { useEffect, useState } from 'react';
import { getBillingHistory, getBillingPlans, getPaymentMethods } from 'services/api';
import {
  addNotification,
  decLoaderCountAction,
  fetchOrganisations,
  fetchUser,
  incLoaderCountAction,
  selectOrgData,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { BillingHistory as BillingHistoryType, PaymentMethodsData } from 'types';
import { BillingPlan } from 'types/billing/billing.plan.ts';

import styles from './billingPage.module.scss';

export const BillingPage = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const orgData = useAppSelector(selectOrgData);

  const [isOpenAddPaymentMethod, setIsOpenAddPaymentMethod] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PaymentMethodsData | null>(null);

  const [data, setData] = useState<PaymentMethodsData[]>([]);
  const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<BillingPlan | undefined>(undefined);
  const [activePlanContent, setActivePlanContent] = useState<CardContent | undefined>(undefined);

  const [history, setHistory] = useState<BillingHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePlan, setIsChangePlan] = useState(false);

  useEffect(() => {
    dispatch(fetchOrganisations());
    updatePaymentMethods();
    updateBillingHistory();
  }, [user]);

  useEffect(() => {
    if (!orgData) return;
    dispatch(incLoaderCountAction());
    getBillingPlans()
      .then((r) => {
        setBillingPlans(r.data);
        const { content, activePlan } = getActiveBillingPlanContent(orgData.billingPlanId, r.data, () =>
          setIsChangePlan(true),
        );
        setActivePlanContent(content);
        setActivePlan(activePlan);
      })
      .catch(() => {
        dispatch(addNotification({ type: 'error', title: 'Error', message: 'Cannot get billing plans' }));
      })
      .finally(() => {
        dispatch(decLoaderCountAction());
      });
  }, [orgData]);

  const updatePaymentMethods = () => {
    if (!user?.customerId) return;

    setIsLoading(true);
    getPaymentMethods(user.customerId)
      .then((r) => {
        setData(r.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateBillingHistory = async () => {
    if (!user?.customerId) return;
    setIsLoading(true);
    await getBillingHistory({ customerId: user.customerId })
      .then((res) => {
        setHistory(res.data);
      })
      .catch(() => {
        dispatch(addNotification({ type: 'error', title: 'Billing history error', message: '' }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClickAddCard = () => {
    setIsOpenAddPaymentMethod(true);
  };
  if (isLoading) return <Loader type={'full-page'} />;
  return (
    <div className={styles.container}>
      {isOpenAddPaymentMethod && (
        <AddPaymentCardForm
          onClose={() => setIsOpenAddPaymentMethod(false)}
          onUpdate={() => {
            dispatch(fetchUser());
            updatePaymentMethods();
          }}
        />
      )}
      {selectedCard && (
        <PaymentForm
          onClose={() => setSelectedCard(null)}
          card={selectedCard}
          onUpdate={async () => {
            dispatch(fetchOrganisations());
            await updateBillingHistory();
          }}
        />
      )}
      <div className={styles.header}>
        {!isChangePlan ? (
          <Button label={'Add card'} onClick={handleClickAddCard} />
        ) : (
          <Button label={'Back'} onClick={() => setIsChangePlan(false)} />
        )}

        {/*<div className={styles.balance}>Balance: ${user ? convertAmount(user.balance) : ''}</div>*/}
      </div>

      {isChangePlan && activePlan ? (
        <BillingPlans
          billingPlans={billingPlans}
          activePlan={activePlan}
          onUpdate={() => {
            dispatch(fetchOrganisations());
          }}
        />
      ) : (
        <div className={styles.cardsHolder}>
          {activePlanContent && <ChangePlanCard content={activePlanContent} />}
          {data.map((item) => (
            <PaymentCard key={item.id} card={item.card} onClickCard={() => setSelectedCard(item)} />
          ))}
        </div>
      )}

      {/* <BillingTabs /> */}
      <BillingHistory history={history} />
    </div>
  );
};
