import cx from 'classnames';
import { CSSProperties } from 'react';
import styles from './callButton.module.scss';

interface IButton {
  onClick?: any;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
  finish?: boolean;
}
export const CallButton = (props: IButton) => {
  return (
    <button
      style={props.style}
      type="button"
      onClick={(e: any) => {
        if (!props.disabled) {
          props.onClick(e);
        }
      }}
      className={cx({
        [styles.button]: true,
        [styles.button__finishButton]: props.finish,
        [styles.disabled]: props.disabled,
      })}>
      {props.label}
    </button>
  );
};
