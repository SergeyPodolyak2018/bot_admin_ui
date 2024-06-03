import { Node } from 'reactflow';
import { TPosition } from '../types';

export type TFormProps = {
  data: TPosition;
  createNode: (value: React.SetStateAction<Node[]>) => void;
  close: () => void;
  idSaver: {
    newId: number;
    iterate: (id: number) => void;
  };
  

};
