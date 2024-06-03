import { BotFull, BotShort } from 'types';

export type GetBotsResponse = BotShort[];
export type GetBotResponse = BotShort;

export type GetBotByIdResponse = BotFull;

export type PostBotsPayload = {
  name: string;
  organizationId: number;
  language: string;
  greeting: string;
  useContext: boolean;
  useRemarks: boolean;
  useHistory: boolean;
  botPrompt: string;
  config: {
    category: {
      id?: number;
      // name = category_of_{bot_name}
      // language_code = inherit
      // preprocessor = "lambda data: data"
      // splitter_type = "split_json_by_template"
      // threshold = 0.6
      // k_num = 5
      // ignore_history = False
      // add_to_history = True
      // prompt_id - generate
      // file_id - generate
      // bot_id - generate
      fields: {
        iterator: string;
        search: string[];
        output: string[];
      };
    };
    prompt: {
      id?: number;
      // name = prompt_of_{bot_name}
      // organization_id - inherit
      // bot_id - inherit
      // is_no_source = True
      text: string;
    };
    file: {
      // name = file_of_{bot_name}
      // organization_id - inherit
      // bot_id - inherit
      extension: string;
      data?: File;
    };
  };
};

export type PutBotsPayload = {
  name: string;
  organizationId: number;
  language: string;
  greeting: string;
  useContext: boolean;
  useRemarks: boolean;
  useHistory: boolean;
  config: {
    category: {
      id: number;
      // name = category_of_{bot_name}
      // language_code = inherit
      // preprocessor = "lambda data: data"
      // splitter_type = "split_json_by_template"
      // threshold = 0.6
      // k_num = 5
      // ignore_history = False
      // add_to_history = True
      // prompt_id - generate
      // file_id - generate
      // bot_id - generate
      fields?: {
        iterator: string;
        search: string[];
        output: string[];
      };
    };
    prompt: {
      id: number;
      // name = prompt_of_{bot_name}
      // organization_id - inherit
      // bot_id - inherit
      // is_no_source = True
      text?: string;
    };
    file: {
      id: number;
      // name = file_of_{bot_name}
      // organization_id - inherit
      // bot_id - inherit
      data?: File;
    };
  };
};
