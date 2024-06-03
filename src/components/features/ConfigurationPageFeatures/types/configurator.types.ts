export type TTypeNode = 'file' | 'category' | 'promt';

export type TActiveFormType = {
  type: TTypeNode;
  active: boolean;
};

export type TPosition = {
  x: number;
  y: number;
  type: string;
  id: string | undefined;
};

export type TpageViewType = 'bots' | 'configurator';
