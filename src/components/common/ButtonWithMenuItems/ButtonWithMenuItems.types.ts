import { CSSProperties } from 'react';

export type MenuItemsProps = {
  onClick?: () => void;
  style?: CSSProperties;
  menuItems: MenuItem[];
  label: string;
  isRunning?: boolean;
  isHidden?: boolean;
  withoutMenu?: boolean;
  defaultButtonStyle?: boolean;
  disabled?: boolean;
};

export type MenuItem = {
  label: string;
  onClick: () => void;
};
