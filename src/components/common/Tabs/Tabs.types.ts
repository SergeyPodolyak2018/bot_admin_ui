import { CSSProperties } from 'react';
import { ClassNames } from 'types';

export type Tab = {
  name: string;
  onClick: (name: string) => void;
  label: string;
  hidden?: boolean;
};

export type TabsProps = {
  tabs: Tab[];
  active: string;
  style?: CSSProperties;
  classNames?: ClassNames;
};
