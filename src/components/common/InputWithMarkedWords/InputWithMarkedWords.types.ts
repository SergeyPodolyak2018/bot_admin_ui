import { HTMLProps, RefObject } from 'react';
import { ITag } from 'utils/tagsMap';

type TPreprocessor = (text: string) => string;

export interface IInputWithMarkedWordsProps extends HTMLProps<HTMLElement> {
  reference: RefObject<HTMLDivElement>;
  text: string;
  lable: string;
  preprocessors: TPreprocessor[];
  style?: React.CSSProperties;
  wrapperstyle?: React.CSSProperties;
  onDragOver?: (e: any) => void;
  onDropCallback?: () => void;
  keyup?: () => void;
  draggableTag?: ITag | undefined;
  activeCategory?: string;
  onTagCloseCallback?: (id: string) => void;
  onInitialTagsRender?: (tagsInfo: ITag[]) => void;
  isInstructions?: boolean;
}
