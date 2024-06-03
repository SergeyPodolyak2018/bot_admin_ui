import { HTMLProps } from 'react';

export interface IButtonProps extends HTMLProps<HTMLElement> {
  innerText: string;
  urlTarget: string;
  urlCurrent: string;
  click: (url: string) => void;
  icon: string;
  entity: string | undefined;
  privileges: string[] | undefined;
}
