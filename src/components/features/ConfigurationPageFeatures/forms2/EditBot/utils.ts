//"{\"iterator\":\"price\",\"template\":\"{product_name}\\n{meta_keywords}\\n{link}\\n{price}\",\"metadatas\":{\"output\":\"Product_name:{product_name}\\nPrice:{price}\\nMeta_keywords:{meta_keywords}\",\"h_output\":\"\",\"h_template\":\"\"}}"
import { BotFormFields } from './EditBot.types.ts';
import { PutBotsPayload } from 'services/api';

export const parseSplitterConfig = (string: string) => {
  const config = JSON.parse(string);
  const templateString = config.template;
  const outputString = config.metadatas.output;

  const regex = /\{([^}]+)\}/g;

  const keysInTemplate = [];
  const keysInOutput = [];

  let match;

  while ((match = regex.exec(templateString)) !== null) {
    keysInTemplate.push(match[1]);
  }

  while ((match = regex.exec(outputString)) !== null) {
    keysInOutput.push(match[1]);
  }

  return {
    iterator: config.iterator,
    keysInTemplate,
    keysInOutput,
  };
};

export const prepareDataForSend = (
  {
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
    categoryId,
    promptId,
    fileId,
  }: BotFormFields,
  categoriesLength?: number,
): PutBotsPayload => {
  return {
    name,
    greeting,
    useContext: useContext === 'on',
    useHistory: useHistory === 'on',
    useRemarks: useRemarks === 'on',
    organizationId: Number(organizationId),
    language,
    config: {
      file: {
        id: fileId,
      },
      category: {
        id: Number(categoryId),
        fields:
          categoriesLength && categoriesLength <= 1
            ? {
                iterator,
                output,
                search,
              }
            : undefined,
      },
      prompt: {
        id: Number(promptId),
        text: prompt,
      },
    },
  };
};
