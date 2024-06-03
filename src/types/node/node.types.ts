export type TTypeNode = 'file' | 'category' | 'promt';
export type TNodeData = {
  value: number;
  label: string;
};

export type TNodeInitial = {
  id: string;
  type: TTypeNode;
  data: TNodeData;
  position: { x: number; y: number };
};
