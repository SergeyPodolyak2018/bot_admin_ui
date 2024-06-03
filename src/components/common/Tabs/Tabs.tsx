import cx from 'classnames';
import styles from './Tabs.module.scss';
import { TabsProps } from './Tabs.types.ts';

export const Tabs = ({ tabs, active, style, classNames }: TabsProps) => {
  return (
    <div className={cx(classNames, styles.wrapper)}>
      {tabs
        .filter((tab) => !tab.hidden)
        .map((tab, index) => (
          <div
            key={tab.name}
            style={{ ...style, zIndex: tab.name === active ? 200 : 20 - index }}
            onClick={() => {
              tab.onClick(tab.name);
            }}
            className={`${styles.button} ${tab.name !== active && styles.disactive}`}>
            {tab.label}
          </div>
        ))}
    </div>
  );
};
