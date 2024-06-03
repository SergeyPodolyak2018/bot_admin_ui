import { BotsState } from './bots.types';

export const initialBotState: BotsState = {
  botsList: [],
  categories: [],
  config: {
    bot: null,
    categories: [],
    files: [],
    prompts: [],
    phone: '',
    llmModelId: '',
  },
  activeBot: -1,
  loading: true,
  error: null,
  showEditWindow: false,
  showDeleteWindow: false,
  chatBotWidgetVisible: false,
  chatBotWidgetHidden: true,
  editTarget: {
    type: 'file',
    id: -1,
    action: 'create',
  },
  chatIsOpen: false,
};
