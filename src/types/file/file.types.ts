export type TFile = {
  id: number;
  name: string;
  isNoSource: boolean;
  keys: string[];
  organization: {
    id: number;
    name: string;
  };
  file: {
    data: ArrayBuffer;
    type: string;
  };
  extension: 'csv' | 'txt' | 'json' | '';
};
