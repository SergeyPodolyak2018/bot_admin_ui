import { CSSProperties } from 'react';

export type DropdownFilterOption = {
  value: string;
  label: string;
};

export type DropdownFilterProps = {
  text?: string;
  options: DropdownFilterOption[];
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  icon?: boolean;
  style?: CSSProperties;
};
