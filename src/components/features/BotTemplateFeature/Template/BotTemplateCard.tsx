import { FC } from 'react';
import { IBotTemplateCard } from './BotTemplate.types';
import styles from './callList.module.scss';

export const BotTemplateCard: FC<IBotTemplateCard> = ({ header, img, text, cklick, active }) => {
  const url = `url("data:image/png;base64,${img}")`;

  const navigate = () => {
    if (active) {
      cklick();
    }
  };

  return (
    <div className={`${styles.card} ${!active && styles.active}`} onClick={navigate}>
      <div className={styles.card_img} style={{ backgroundImage: url }}>
        <div className={styles.header}>{header}</div>
      </div>
      <div className={styles.footer}>{text}</div>
    </div>
  );
};
