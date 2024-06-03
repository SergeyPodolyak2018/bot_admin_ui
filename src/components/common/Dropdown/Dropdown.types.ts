import { CSSProperties } from 'react';
import { ClassNames } from 'types';

export interface IDropDownProps {
  options: DropdownOptions;
  selectedOption?: IOption;
  onChange: (selectedOption: IOption) => void;
  styles?: CSSProperties;
  icon?: 'org';
  className?: ClassNames;
  subClassName?: ClassNames;
  popUpClassName?: ClassNames;
  open?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  disabled?: boolean;
}

export interface IOption {
  label: string;
  value: string;
}

export type DropdownOptions = IOption[];
