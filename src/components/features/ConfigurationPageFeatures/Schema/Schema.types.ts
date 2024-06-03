import { TConfig } from 'types/index.ts';
import { UseConfigurationData } from '../index.ts';

export type SchemaProps = {
  confHookData: UseConfigurationData;
  botId: string | number | undefined;
  data: TConfig;
  loading: boolean;
  idSaver: {
    newId: number;
    iterate: (id: number) => void;
  };
};
