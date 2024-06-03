import AddCardIcon from '@mui/icons-material/AddCard';
import PaymentIcon from '@mui/icons-material/Payment';
import SellIcon from '@mui/icons-material/Sell';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddPaymentCardForm } from './AddPaymentCardForm';
import { PaymentForm } from './PaymentForm';
import { SubscribeForm } from './SubscribeForm';

export const PaymentMethods = () => {
  const { t } = useTranslation();
  const [isAddCardOpen, setIsAddCartOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubscribeFormOpen, setIsSubscribeFormOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsAddCartOpen(true)} startIcon={<AddCardIcon />} variant={'contained'}>
        {t('billingTabs.addPaymentMethods')}
      </Button>
      <Button sx={{ ml: '10px' }} onClick={() => setIsFormOpen(true)} startIcon={<PaymentIcon />} variant={'contained'}>
        {t('billingTabs.pay')}
      </Button>
      <Button
        sx={{ ml: '10px' }}
        onClick={() => setIsSubscribeFormOpen(true)}
        startIcon={<SellIcon />}
        variant={'contained'}
      >
        {t('billingTabs.subscribe')}
      </Button>
      {isAddCardOpen && <AddPaymentCardForm onClose={() => setIsAddCartOpen(false)} onUpdate={() => {}} />}
      {isFormOpen && <PaymentForm card={{} as any} onClose={() => setIsFormOpen(false)} onUpdate={() => {}} />}
      {isSubscribeFormOpen && <SubscribeForm onClose={() => setIsSubscribeFormOpen(false)} />}
    </>
  );
};
