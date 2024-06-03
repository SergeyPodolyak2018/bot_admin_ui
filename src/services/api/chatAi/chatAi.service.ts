import { AxiosResponse } from 'axios';

import { aiAxiosInstance as axiosInstance } from 'utils/axios';
import { ASK, CLEAR, DEFAULT_INIT_TIMEOUT, INIT } from './chatAi.constants.ts';
import { AskBotPayload, AskBotResponse, ClearBotPayload, InitBotPayload } from './chatAi.types.ts';
import { prepareUri } from './chatAi.utils.ts';

export const initBot = ({ botId, chatId, waitMs }: InitBotPayload): Promise<AxiosResponse> => {
  return axiosInstance.get(prepareUri({ base: INIT, botId, chatId }), {
    timeout: waitMs || DEFAULT_INIT_TIMEOUT,
  });
};

export const clearBot = ({ botId, chatId }: ClearBotPayload): Promise<AxiosResponse> => {
  return axiosInstance.get(prepareUri({ base: CLEAR, botId, chatId }));
};

export const askBot = ({ botId, chatId, waitMs, question }: AskBotPayload): Promise<AxiosResponse<AskBotResponse>> => {
  return axiosInstance.post(
    prepareUri({ base: ASK, botId, chatId }),
    {
      question,
    },
    {
      timeout: waitMs || DEFAULT_INIT_TIMEOUT,
    },
  );
};
