import { HTMLInputAutoCompleteAttribute, useEffect, useState } from 'react';
import { KeyCodes } from 'utils/primitives/KeyCodes';
import HidePasswordIcon from '../../../../assets/svg/hidePasswordIcon.svg';
import hidePasswordIconDisabeled from '../../../../assets/svg/hidePasswordIconDisabeled.svg';
import ShowPasswordIcon from '../../../../assets/svg/showPassIcon.svg';
import styles from './customInput.module.scss';

interface IInputProps {
  placeHolder: string;
  label: string;
  subLabel?: string;
  isPassword?: boolean;
  onChange: (event: any) => void;
  type?: string;
  onKeyDown?: (event: any) => void;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disable?: boolean;
}
export const CustomInput = (props: IInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleKeyDown = (event: any) => {
    if (event.keyCode === KeyCodes.Enter) {
      if (!props.onKeyDown) return;
      props.onKeyDown(event);
    }
  };
  useEffect(() => {
    if (props.disable) {
      setShowPassword(false);
    }
  }, [props.disable]);

  return (
    <div className={styles.inputContainer}>
      <label className={`${styles.label} ${props.disable ? styles.disable : ''}`}>{props.label}</label>
      <div className={styles.inputHolder}>
        <input
          onKeyDown={handleKeyDown}
          type={props.isPassword && !showPassword ? 'password' : props.type}
          className={`${styles.input} ${props.disable ? styles.disable : ''}`}
          autoComplete={props.autoComplete ? props.autoComplete : 'off'}
          placeholder={props.placeHolder}
          onChange={(event: any) => {
            props.onChange(event);
          }}
          disabled={props.disable}
        />
        {props.isPassword &&
          (props.disable ? (
            <div className={`${styles.showPasswordButton} ${props.disable ? styles.disable : ''}`}>
              <img src={hidePasswordIconDisabeled} alt="ShowPassword" />
            </div>
          ) : (
            <div
              className={`${styles.showPasswordButton} ${props.disable ? styles.disable : ''}`}
              onClick={() => togglePasswordVisibility()}>
              <img src={showPassword ? HidePasswordIcon : ShowPasswordIcon} alt="ShowPassword" />
            </div>
          ))}
      </div>
      {props.subLabel && (
        <label className={`${styles.subLabel} ${props.disable ? styles.disable : ''}`}>{props.subLabel}</label>
      )}
    </div>
  );
};
