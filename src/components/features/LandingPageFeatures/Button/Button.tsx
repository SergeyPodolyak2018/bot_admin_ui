import { CSSProperties } from 'react';
import styles from './button.module.scss';

interface IButton {
  onClick?: any;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  selected?: boolean;
  className?: string;
}
export const Button = (props: IButton) => {
  return (
    <button
      style={props.style}
      type="button"
      onClick={() => {
        if (!props.disabled && typeof props.onClick === 'function') {
          props.onClick();
        }
      }}
      className={`${props.className} ${styles.button} ${props.disabled ? styles.disabled : ''}  ${
        props.selected ? styles.selected : ''
      }`}>
      {props.label}
    </button>
  );
};
