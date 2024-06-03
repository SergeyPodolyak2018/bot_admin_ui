import cx from 'classnames';
import { CSSProperties, useState } from 'react';
import { ClassNames } from 'types';
import styles from './Button.module.scss';

interface IButton {
  onClick?: () => void;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset' | undefined;
  inverse?: boolean;
  icon?: string;
  reversedIcon?: string;
  classNames?: ClassNames;
}

export const Button = ({ classNames, label, onClick, type, inverse, icon, reversedIcon, style, disabled }: IButton) => {
  const [mouseIsOverButton, setMouse] = useState(false);
  return (
    <button
      onMouseEnter={() => {
        if (icon) {
          setMouse(true);
        }
      }}
      onMouseLeave={() => {
        if (icon) {
          setMouse(false);
        }
      }}
      style={style}
      type={type || 'button'}
      onClick={() => {
        if (!disabled && typeof onClick === 'function') {
          onClick && onClick();
        }
      }}
      className={cx(classNames, styles.button, {
        [styles.disabled]: disabled,
        [styles.inverse]: inverse,
      })}>
      {icon && <img className={`${styles.icon}`} src={mouseIsOverButton ? icon : reversedIcon} alt="Retry" />}
      {label}
    </button>
  );
};
