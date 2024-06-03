import { CSSProperties } from 'react';

export type MenuItemsProps = {
  style?: CSSProperties;
  menuItems: MenuItem[];
  notDefaultMenu?: boolean;
};

export type MenuItem = {
  label: string;
  onClick: () => void;
  isCheckBox?: boolean;
  checked?: boolean;
  toolTipText?: string;
};

export type MenuItemSvg = {
  label: string;
  svg: string;
};
