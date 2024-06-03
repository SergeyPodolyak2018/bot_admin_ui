export type EditBotProps = {
  close: () => void;
};

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
  categoryId: number;
  promptId: number;
  fileId: number;
  botPrompt: string;
  extension: string;
};
