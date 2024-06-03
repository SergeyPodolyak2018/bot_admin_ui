import { HTMLProps, RefObject } from 'react';
import { TCategore } from 'types';

type TPreprocessor = (text: string) => string;

export interface IInputWithMarkedWordsProps extends HTMLProps<HTMLElement> {
  reference: RefObject<HTMLDivElement>;
  text: string;
  lable: string;
  preprocessors: TPreprocessor[];
  style?: React.CSSProperties;
  wrapperstyle?: React.CSSProperties;
  keyup?: (promptId:number) => void;
  activeCategory: TCategore | undefined;
  activeCategoryName: string;
  wrapperClassName?: string;
}
