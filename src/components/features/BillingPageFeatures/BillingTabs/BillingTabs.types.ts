import { ReactNode } from 'react';

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export interface Tab {
  label: string;
  el: () => JSX.Element;
}
