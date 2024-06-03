import { BotFull, TCategore, TFile, TPromt } from '..';

export type TConfigFile = TFile & {
  changed?: boolean;
  deleted?: boolean;
  tempShowInSchema?: boolean;
  tempDisign?: string;
};
export type TConfigPrompt = TPromt & {
  changed?: boolean;
  deleted?: boolean;
  tempShowInSchema?: boolean;
  tempDisign?: string;
};
export type TConfigCategory = TCategore & { changed?: boolean; deleted?: boolean; containeNonExist?: boolean };

export type TConfig = {
  bot: (BotFull & { changed?: boolean }) | null;
  categories: TConfigCategory[];
  files: TConfigFile[];
  prompts: TConfigPrompt[];
  changesExist?: boolean;
  phone: string;
  llmModelId: string;
};
