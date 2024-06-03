export type BotFormFields = {
  file: File;
  greeting: string;
  iterator: string;
  language: string;
  useContext?: 'on';
  useRemarks?: 'on';
  useHistory?: 'on';
  name: string;
  organizationId: string;
  prompt: string;
  search: string[];
  output: string[];
  extension: string;
};

export type ValidationState = {
  name: boolean;
  greeting: boolean;
  prompt: boolean;
  language: boolean;
};
