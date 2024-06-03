import styles from './PaymentCard.module.scss';
import Astertisk from 'assets/svg/Astertisk.svg?react';
import { FC } from 'react';
import { PaymentCardProps } from './PaymentCard.types.ts';
import { Button } from 'components/common';

export const PaymentCard: FC<PaymentCardProps> = ({ card, onClickCard }) => {
  return (
    <div className={styles.paymentCard}>
      <div className={styles.paymentCard__header}>
        {/*<div className={styles.defaultLabel}>Default</div>*/}

        <Button label={'Pay'} onClick={() => onClickCard && onClickCard(card)} inverse={true} />
      </div>
      <span className={styles.cardNumber}>
        <div className={styles.imagesHolder}>
          <Astertisk />
          <Astertisk />
          <Astertisk />
          <Astertisk />
        </div>
        <div className={styles.imagesHolder}>
          <Astertisk />
          <Astertisk />
          <Astertisk />
          <Astertisk />
        </div>
        <div className={styles.imagesHolder}>
          <Astertisk />
          <Astertisk />
          <Astertisk />
          <Astertisk />
        </div>
        {card.last4}
      </span>
      <div className={styles.expireHolder}>
        {/* <span className={styles.expireLabel}>{card.brand}</span> */}
        <span className={styles.expireLabel}>Expire date</span>
        <span className={styles.expireDateLabel}>
          {card.exp_month}/{card.exp_year}
        </span>
      </div>
    </div>
  );
};
