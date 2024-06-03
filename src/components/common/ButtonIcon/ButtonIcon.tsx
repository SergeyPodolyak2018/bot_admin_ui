import { CSSProperties } from 'react';
import styles from './buttonIcon.module.scss';

interface IButton {
  onClick?: any;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  selected?: boolean;
  icon?: string;
}
export const ButtonIcon = (props: IButton) => {
  const url = `url(${props.icon})`;
  return (
    <button
      style={props.style}
      type="button"
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
      className={`${styles.button} ${props.disabled ? styles.disabled : ''}  ${props.selected ? styles.selected : ''}`}>
      <span className={styles.iconHolder} style={{ backgroundImage: url }}></span>
      {props.label}
    </button>
  );
};
