import { CSSProperties, ChangeEventHandler } from 'react';

export type InputSearchChangeEvent = ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

export type InputSearchProps = {
  placeholder: string;
  id?: string;
  value: string;
  onChange: InputSearchChangeEvent;
  style?: CSSProperties;
  customClass?: any;
};
