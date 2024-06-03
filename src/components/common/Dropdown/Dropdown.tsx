import cx from 'classnames';
import { FC, useMemo, useState } from 'react';
import { useClickOutside } from 'utils/hooks';
import s from './Dropdown.module.scss';
import { IDropDownProps, IOption } from './Dropdown.types';
import ShieldIcon from './shield.svg?react';

export const Dropdown: FC<IDropDownProps> = ({
  position = 'top-left',
  open,
  styles,
  selectedOption,
  options,
  onChange,
  className,
  subClassName,
  popUpClassName,
  icon,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionClick = (option: IOption) => {
    onChange(option);
    setIsOpen(false);
  };
  const { ref } = useClickOutside({ cb: () => setIsOpen(false) });
  const getPos = (position: string) => {
    const [y, x] = position.split('-');
    return { x, y };
  };
  const { x, y } = useMemo(() => getPos(position), [position]);
  return (
    <div className={cx(s.dropdown, className)} ref={ref} style={styles}>
      {selectedOption && (
        <div
          className={cx(disabled ? s.disabled : s.selectedValue, subClassName)}
          onClick={() => {
            if (disabled) return;
            setIsOpen(!isOpen);
          }}>
          {icon === 'org' && <ShieldIcon />}
          {selectedOption.label}
          <span className={`${s.arrowIcon} ${open || isOpen ? s.arrowUp : ''}`}></span>
        </div>
      )}
      {(open || isOpen) && (
        <div
          className={cx(
            s.options,
            {
              [s.options__left]: x === 'left',
              [s.options__right]: x === 'right',
              [s.options__top]: y === 'top',
              [s.options__bottom]: y === 'bottom',
            },
            popUpClassName,
          )}>
          {options.map((option, index) => (
            <div className={s.optionHolder}>
              <div key={index} className={s.option} onClick={() => handleOptionClick(option)}>
                {option.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
