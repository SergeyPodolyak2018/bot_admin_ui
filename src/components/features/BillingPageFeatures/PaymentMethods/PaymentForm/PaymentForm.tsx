import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, createFilterOptions, IconButton, Input, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Loader } from 'components/common';
import { FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPayment } from 'services/api';
import { addNotification, selectOrg, selectUser, useAppDispatch, useAppSelector } from 'store';
import logger from 'utils/logger.ts';
import { options } from './constants.ts';
import styles from './paymentForm.module.scss';
import { AmountOptionType, PaymentFormProps } from './PaymentForm.types.ts';

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
const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiFormControl-root': {
    borderRadius: '10px',
  },
}));

const filter = createFilterOptions<AmountOptionType>();

export const PaymentForm: FC<PaymentFormProps> = ({ onClose, card, onUpdate }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const org = useAppSelector(selectOrg);

  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<AmountOptionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    if (!amount || !amount.title || !org) return;
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      logger.error('Stripe.js has not yet loaded.');
      return;
    }
    if (!user || !user.customerId) return logger.error(`user customerId not found - ${user}`);
    setIsLoading(true);

    let price = amount.title;
    price = !price.includes('.') ? `${price}00` : price.replace('.', '');

    const clientSecret = await createPayment({
      amount: price,
      customerId: user.customerId,
      metadata: {
        last4: card.card.last4,
        userId: user.id,
        organizationId: org.value,
      },
    })
      .then((res) => res.data.client_secret)
      .catch((err) => {
        dispatch(addNotification({ type: 'error', title: 'Add payment error', message: '' }));
        logger.error(err.message);
      });

    if (!clientSecret) return logger.error('client secret not found');

    logger.info('Client secret returned');
    // const card = elements.getElement(CardElement);
    if (!card) return logger.error('card not found');
    const { error: stripeError, paymentIntent } = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: card.id,
      })
      .then((r) => {
        return r;
      })
      .finally(() => {
        setIsLoading(false);
      });

    if (stripeError?.message) {
      // Show error to your customer (e.g., insufficient funds)
      logger.error(stripeError.message);
      dispatch(addNotification({ type: 'error', title: 'Add payment error', message: '' }));
      return;
    }

    // Show a success message to your customer
    // There's a risk of the customer closing the window before callback
    // execution. Set up a webhook or plugin to listen for the
    // payment_intent.succeeded event that handles any business critical
    // post-payment actions.
    logger.info(`Payment ${paymentIntent?.status}: ${paymentIntent?.id}`);
    dispatch(addNotification({ type: 'success', title: 'Add payment success', message: '' }));
    setTimeout(onUpdate, 1000);
    handleClose();
  };

  if (!stripe) return <Loader type={'full-page'} />;
  return (
    <>
      {isLoading && <Loader type={'full-page'} />}
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
          <>
            <label className={styles.lable}>
              Card Number
              <Input
                name={'card'}
                value={`**** **** **** ${card.card.last4}`}
                className={styles.inputCustom}
                disabled={true}
                placeholder="Card number"
                sx={{ color: '#aab7c4', width: '100%' }}></Input>
            </label>

            <label className={styles.lable}>
              Amount
              {/* <FormControl variant="standard" sx={{ m: 1, width: '100%', mt: 2 }}> */}
              <Autocomplete
                className={styles.inputCustom}
                sx={{
                  color: '#aab7c4',
                  width: '100%',
                  paddingLeft: 0,
                  border: 'none',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    color: '#aab7c4',
                  },
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    color: '#aab7c4',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                    color: '#aab7c4',
                  },
                  '& .MuiInputBase-input .MuiOutlinedInput-input': {
                    color: '#aab7c4',
                  },
                }}
                value={amount}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setAmount({
                      title: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setAmount({
                      title: newValue.inputValue,
                    });
                  } else {
                    setAmount(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.title);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `Pay "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={options}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.title;
                }}
                renderOption={(props, option) => (
                  <li {...props} style={{ color: '#aab7c4' }}>
                    {option.title}
                  </li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Amount $" className={styles.inputCustom} />
                )}
              />
              {/* </FormControl> */}
            </label>
          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }} className={styles.actions}>
          <Button disabled={!stripe || !amount} type="submit" label={t('billingTabs.pay')}></Button>
        </DialogActions>
        {/* <img src={safeImg} alt={'safe & secure'} /> */}
      </CustomDialog>

      {/* <Dialog
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
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogTitle>{t('billingTabs.selectAmount')}</DialogTitle>
        <DialogContent>
          
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120, mt: 2 }}>
            <Autocomplete
              value={amount}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setAmount({
                    title: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setAmount({
                    title: newValue.inputValue,
                  });
                } else {
                  setAmount(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.title);
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    title: `Pay "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={options}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.title;
              }}
              renderOption={(props, option) => <li {...props}>{option.title}</li>}
              sx={{ width: 300 }}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Amount $" />}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button disabled={!stripe || !amount} type="submit" label={t('billingTabs.pay')} />
        </DialogActions>
      </Dialog> */}
    </>
  );
};
