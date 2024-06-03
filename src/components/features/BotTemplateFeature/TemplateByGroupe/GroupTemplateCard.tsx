import { Button } from 'components/common';
import { FC } from 'react';
import styles from './groupTemplate.module.scss';
import { IGroupTemplateCard } from './GroupTemplate.types';

export const GroupTemplateCard: FC<IGroupTemplateCard> = ({ header, text, use, active }) => {
  const actionHolder = () => {
    if (active) {
      use();
    }
  };
  return (
    <div className={`${styles.card} ${!active && styles.active}`}>
      <div className={styles.header}>{header}</div>
      <div className={styles.contentHolder}>
        <div className={styles.body}>{text}</div>
        <div className={styles.footer}>
          {/* <TryItNowButton
          label={'View Template'}
          onClick={() => {
            view();
          }}
          style={{ height: '48px', marginLeft: 'auto', width: '165px' }}
          inverse={true}
        /> */}
          <Button
            label={'Use Template'}
            style={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '19px',
              textWrap: 'nowrap',
              height: '48px',
              width: '158px',
            }}
            onClick={actionHolder}
          />
        </div>
      </div>
    </div>
  );
};
