import { PaymentCard } from 'types';

export type PaymentCardProps = {
  card: PaymentCard;
  onClickCard?: (card: PaymentCard) => void;
};
