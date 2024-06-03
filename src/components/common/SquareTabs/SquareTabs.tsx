import cx from 'classnames';
import { FC } from 'react';
import styles from './SquareTabs.module.scss';
import { SquareTabsProps } from './SquareTabs.types.ts';

export const SquareTabs: FC<SquareTabsProps> = ({ tabs, style, onClick, active }) => {
  return (
    <div className={styles.wrapper}>
      {tabs.map((tab) => (
        <div
          key={tab.name}
          style={{ ...style, width: tab.width }}
          className={cx(styles.button, {
            [styles.active]: tab.name === active && !tab.disabled,
            [styles.disabled]: tab.disabled,
          })}
          onClick={() => onClick(tab.name)}>
          {tab.label}
        </div>
      ))}
    </div>
  );
};
