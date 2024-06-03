import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Input } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import safeImg from 'assets/img/paymentFormFooter.png';
import { Button, Loader } from 'components/common';
import { FC, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createCustomer, savePaymentMethod } from 'services/api';
import { addNotification, selectUser, useAppDispatch, useAppSelector } from 'store';
import logger from 'utils/logger.ts';
import { AddPaymentCardFormProps } from './AddPaymentCardForm.types.ts';
import styles from './addPaymentCard.module.scss';
import './stripe.scss';
import { styled } from '@mui/material/styles';
import { Troubleshoot } from '@mui/icons-material';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '10px',
    width: '441px',
    height: '514px',
    padding: '44px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

const useOptions = () => {
  const options = useMemo(
    () => ({
      style: {
        base: {
          margin: '4px 0px 14px 0px',
          color: 'rgba(179, 179, 179, 1)',
          letterSpacing: '0.025em',
          fontFamily: 'Helvetica Neue',
          fontSize: '16px',
          '::placeholder': {
            color: 'rgba(179, 179, 179, 1)',
            fontSize: '16px',
          },
        },
        invalid: {
          color: 'rgba(249, 109, 109, 1)',
        },
      },
    }),
    [],
  );

  return options;
};

export const AddPaymentCardForm: FC<AddPaymentCardFormProps> = ({ onClose, onUpdate }) => {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  useEffect(() => {}, [stripe]);

  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = data.get('name') || '';
    const element = elements?.getElement(CardNumberElement);

    if (!stripe || !element) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    let customerId = user?.customerId as string;
    if (user && !customerId) {
      customerId = await createCustomer({
        email: user.email,
        name: user.name || '',
        userId: user.id,
      }).then((r) => r.data);
    }

    const result = await stripe.createPaymentMethod({
      card: element,
      type: 'card',
      billing_details: {
        email: user?.email,
        name: name as string,
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      logger.error(result.error.message);
    } else {
      await savePaymentMethod({ pmId: result.paymentMethod.id, customerId })
        .then(() => {
          dispatch(addNotification({ type: 'success', title: 'Add payment method success', message: '' }));
          onUpdate();
        })
        .finally(() => {
          handleClose();
        });
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  if (!stripe) return <Loader type={'full-page'} />;
  return (
    <>
      <CustomDialog
        className={styles.wrapper}
        open={true}
        maxWidth={'sm'}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          id: 'payment-form',
          onSubmit,
        }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 36,
            top: 36,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogTitle className={styles.title}>{t('billingTabs.addCard')}</DialogTitle>
        <DialogContent className={styles.content}>
          {!stripe ? (
            <div className={styles.loaderContainer}>
              <Loader type={'inline'} />
            </div>
          ) : (
            <>
              <label className={styles.lable}>
                Cardholder’s Name
                <Input
                  name={'name'}
                  className={styles.inputCustom}
                  required
                  placeholder="Cardholder’s Name"
                  sx={{ color: '#aab7c4', width: '100%' }}></Input>
              </label>

              <label className={styles.lable}>
                Card Number
                <CardNumberElement
                  options={{ ...options, ...{ showIcon: true, placeholder: 'Enter Card Number' } }}
                  className={styles.field}
                />
              </label>
              <div className={styles.rowfields}>
                <label className={styles.lable}>
                  Expiry
                  <CardExpiryElement options={options} className={`${styles.field} ${styles.rowField}`} />
                </label>
                <label className={styles.lable}>
                  CVC
                  <CardCvcElement
                    options={{ ...options, ...{ placeholder: '***' } }}
                    className={`${styles.field} ${styles.rowField}`}
                  />
                </label>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }} className={styles.actions}>
          <Button disabled={!stripe} type="submit" label={t('billingTabs.add')}></Button>
        </DialogActions>
        {/* <img src={safeImg} alt={'safe & secure'} /> */}
      </CustomDialog>
    </>
  );
};
