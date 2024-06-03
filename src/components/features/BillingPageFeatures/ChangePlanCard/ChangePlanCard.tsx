import { Button } from 'components/common';
import { FC } from 'react';
import styles from './ChangePlanCard.module.scss';

export type CardContent = {
  title: string;
  descriptionTitle: string;
  description: string;
  btnText: string;
  onClick: () => void;
};
type ChangePlanCardProps = {
  content: CardContent;
  active?: boolean;
};
export const ChangePlanCard: FC<ChangePlanCardProps> = ({ content, active }) => {
  return (
    <div className={styles.subsCard}>
      <div className={styles.subsHeader}>
        <span className={styles.subsTitle}>{content.title}</span>
        {/*<div className={styles.subsDate}>7 Days Trial</div>*/}
      </div>
      <div className={styles.subsDescription}>
        <span className={styles.descTitle}>{content.descriptionTitle}</span>
        <span className={styles.descLabel}>{content.description}</span>
      </div>
      <div className={styles.footer}>
        <Button
          disabled={active}
          onClick={content.onClick}
          style={{ width: '151px', height: '48px' }}
          label={active ? 'Subscribed' : content.btnText}
        />
      </div>
    </div>
  );
};
