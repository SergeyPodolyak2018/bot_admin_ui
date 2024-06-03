import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import safeImg from 'assets/img/paymentFormFooter.png';
import { FC, FormEvent } from 'react';
import { savePaymentMethod } from 'services/api';
import logger from 'utils/logger.ts';
import { SubrcribeFormProps } from './SubscribeForm.types.ts';

export const SubscribeForm: FC<SubrcribeFormProps> = ({ onClose }) => {
  //const user = useAppSelector(selectUser);

  const stripe = useStripe();
  const elements = useElements();
  const handleClose = (_e?: any, reason?: string) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    const element = elements?.getElement(CardElement);

    if (!stripe || !element) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      card: element,
      type: 'card',
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      logger.error(result.error.message);
    } else {
      //TODO send payment info to backend
      const res = await savePaymentMethod({ pmId: result.paymentMethod.id, customerId: '' });
      logger.info('res', res.data);
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    // handleClose();
  };

  return (
    <>
      <Dialog
        open={true}
        maxWidth={'sm'}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          id: 'payment-form',
          onSubmit,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <CardElement options={{ hidePostalCode: true }} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            sx={{ minWidth: 150 }}
            disabled={!stripe}
            color={'success'}
            size={'large'}
            variant={'contained'}
            type="submit"
          >
            OK
          </Button>
        </DialogActions>
        <img src={safeImg} alt={'safe & secure'} />
      </Dialog>
    </>
  );
};
