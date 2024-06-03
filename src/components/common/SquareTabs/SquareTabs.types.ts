import { CSSProperties } from 'react';

export type SquareTabsProps = {
  onClick: (name: string) => void;
  tabs: SquareTab[];
  active: string;
  style?: CSSProperties;
};

export type SquareTab = {
  name: string;
  label: string;
  width?: string;
  disabled?: boolean;
};
