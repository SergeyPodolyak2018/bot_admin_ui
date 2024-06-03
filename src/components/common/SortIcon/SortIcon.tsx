import { CSSProperties, FC } from 'react';
import styles from './sortIcon.module.scss';

type TSortIcon = {
  action: boolean;
  direction: 'asc' | 'desc' | '';
  style?: CSSProperties;
  placeholder?: boolean;
};

export const SortIcon: FC<TSortIcon> = (props) => {
  return (
    <>
      {props.placeholder ? (
        <div className={styles.wrapper} style={props.style}>
          <div className={`${styles.container}`}></div>
        </div>
      ) : (
        <div className={styles.wrapper} style={props.style}>
          <div className={`${styles.container}`}>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.35368 0.184664C4.15842 -0.0105987 3.84184 -0.0105987 3.64657 0.184664L0.515907 3.31533C0.200925 3.63031 0.424008 4.16888 0.86946 4.16888H7.13079C7.57624 4.16888 7.79933 3.63031 7.48435 3.31533L4.35368 0.184664Z"
                fill={props.direction === 'asc' && props.action ? 'rgba(31, 31, 31, 1)' : '#BCC8DC'}
              />
            </svg>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.35368 4.08139C4.15842 4.27665 3.84184 4.27665 3.64657 4.08139L0.515907 0.950722C0.200925 0.635739 0.424008 0.097168 0.86946 0.097168H7.13079C7.57624 0.097168 7.79933 0.635739 7.48435 0.950721L4.35368 4.08139Z"
                fill={props.direction === 'desc' && props.action ? 'rgba(31, 31, 31, 1)' : '#BCC8DC'}
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};
