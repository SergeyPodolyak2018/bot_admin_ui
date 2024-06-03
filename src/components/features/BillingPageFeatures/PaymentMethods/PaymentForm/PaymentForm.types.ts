import { PaymentMethodsData } from 'types';

export interface PaymentFormProps {
  onClose: () => void;
  onUpdate: () => void;
  card: PaymentMethodsData;
}

export interface AmountOptionType {
  inputValue?: string;
  title: string;
}
