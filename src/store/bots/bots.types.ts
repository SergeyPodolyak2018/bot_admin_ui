import { SerializedError } from '@reduxjs/toolkit';
import { BotShort } from 'types/bots';
import { TCategore, TConfig, TTypeNode } from '../../types';

export type TEditTarget = {
  type: TTypeNode | 'bot';
  id: number;
  action: 'create' | 'update' | 'delete';
};

export type BotsState = {
  botsList: BotShort[];
  categories: TCategore[];
  config: TConfig;
  activeBot: number | string;
  loading: boolean;
  error: SerializedError | null;
  showEditWindow: boolean;
  showDeleteWindow: boolean;
  chatBotWidgetVisible: boolean;
  chatBotWidgetHidden: boolean;
  editTarget: TEditTarget;
  chatIsOpen: boolean;
};
