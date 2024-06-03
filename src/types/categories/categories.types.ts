import { BotShort, TFile, TPromt } from '..';

export type TCategore = {
  id: number;
  name: string;
  languageCode: string;
  remark: string;
  file: TFile | null;
  fileId: number;
  preprocessor: string;
  splitterType: string;
  splitterConfig: string;
  threshold: number;
  thresholdSensitive: string;
  kNum: number;
  prompt: TPromt | null;
  promptId: number;
  ignoreHistory: boolean;
  addToHistory: boolean;
  design: string;
  bot: BotShort;
  botId: number | string;
};
