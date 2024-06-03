import cx from 'classnames';
import { CSSProperties } from 'react';
import { ClassNames } from 'types';
import styles from './BackButton.module.scss';
import Back from '../../../assets/svg/back.svg?react';
import { useNavigate } from 'react-router-dom';

interface IButton {
  link?: string;
  disabled?: boolean;
  style?: CSSProperties;
  classNames?: ClassNames;
}

export const BackButton = ({ classNames, style, disabled, link }: IButton) => {
  const navigate = useNavigate();
  const goBack = () => {
    link ? navigate(link) : navigate(-1);
  };
  return (
    <Back
      style={style}
      onClick={goBack}
      className={cx(classNames, styles.button, {
        [styles.disabled]: disabled,
      })}
    />
  );
};
