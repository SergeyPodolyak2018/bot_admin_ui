import CircularProgress from '@mui/material/CircularProgress';
import { CSSProperties } from 'react';
import styles from './loadingButton.module.scss';

interface IButton {
  onClick?: any;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  loading?: boolean;
}
export const LoadingButton = (props: IButton) => {
  return (
    <button
      style={props.style}
      type="button"
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
      className={`${styles.button} ${props.disabled ? styles.disabled : ''}`}>
      {props.loading && (
        <span className={styles.progress}>
          <CircularProgress style={{ width: '20px', height: '20px' }} />
        </span>
      )}
      {props.label}
    </button>
  );
};
