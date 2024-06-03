import { FC } from 'react';
import styles from './advantage.module.scss';

interface IAdvantageItem {
  title: string;
  text: string;
  reverse?: boolean;
}
export const AdvantageItem: FC<IAdvantageItem> = (props) => {
  return (
    <div className={`${styles.row} ${props.reverse ? styles.reverse : ''}`}>
      <img className={styles.image} src={'https://via.placeholder.com/1500'} alt="Placeholder Image12"></img>
      <div className={styles.content}>
        <div className={styles.contentBody}>
          <div className={styles.title}>
            <p>{props.title}</p>
          </div>
          <div className={styles.text}>
            <p>{props.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
