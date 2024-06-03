import cx from 'classnames';
import { FC } from 'react';
import styles from './ExitButton.module.scss';
import { IExitButtonProps } from './ExitButton.types';

export const ExitButton: FC<IExitButtonProps> = ({ click, className }) => {
  return <div id="logout-button" className={cx(styles.button, className)} onClick={click}></div>;
};
