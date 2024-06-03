import { PostBotsPayload } from 'services/api';
import { BotFormFields } from './CreateBotForm.types.ts';

export const prepareDataForSend = ({
  name,
  iterator,
  search,
  output,
  prompt,
  greeting,
  organizationId,
  language,
  useContext,
  useRemarks,
  useHistory,
  extension,
}: BotFormFields): PostBotsPayload => {
  return {
    name,
    greeting,
    useContext: useContext === 'on',
    useHistory: useHistory === 'on',
    useRemarks: useRemarks === 'on',
    organizationId: Number(organizationId),
    language,
    botPrompt: '',
    config: {
      file: {
        extension,
      },
      category: {
        fields: {
          iterator,
          output,
          search,
        },
      },
      prompt: {
        text: prompt,
      },
    },
  };
};
