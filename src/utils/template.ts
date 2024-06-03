import { ISplitterConfig, ISplitterConfigIncom } from 'components/features/TemplateBotConfigFeature/KnowldgeBase';
import { postCategore, postFiles, postPrompt, putCategore } from 'services/api';
import { BotFull, TCategore, TFile, TPromt, TWidgetDesign } from 'types';

export const getDefaultCategory = (name: string, id: number, botId: string) => ({
  name: name,
  id: id,
  language_code: 'en',
  remark: '',
  fileId: id,
  preprocessor: 'lambda data: data',
  threshold: 1,
  threshold_sensitive: '',
  kNum: 5,
  prompt_id: id,
  botId: botId,
  ignore_history: false,
  add_to_history: true,
  design: 'default',
  splitter_type: 'split_by_separator',
  splitter_config: '',
  changed: true,
  file: { id: id },
  prompt: { id: id },
});
export const getDefaultPrompt = (name: string, id: number, botId: string, orgId: number, orgName: string) => ({
  id: id,
  name: name + '_prompt',
  isNoSource: false,
  text: '',
  organization: {
    id: orgId,
    name: orgName,
  },
  changed: true,
});
export const getDefaultFile = (name: string, id: number, botId: string, orgId: number, orgName: string) => ({
  id: id,
  name: '',
  isNoSource: true,
  keys: [],
  organization: {
    id: orgId,
    name: orgName,
  },
  file: {
    data: [],
    type: 'Buffer',
  },
  extension: '',
  changed: true,
});
export const getDefaultFileWithData = (
  name: string,
  id: number,
  botId: string,
  orgId: number,
  orgName: string,
  data: ArrayBuffer,
  extension: '' | 'csv' | 'txt' | 'json',
) => ({
  id: id,
  name: name,
  isNoSource: true,
  keys: [],
  organization: {
    id: orgId,
    name: orgName,
  },
  file: {
    data,
    type: 'Buffer',
  },
  extension,
  changed: true,
});
export const getDefaultPromptWithData = (name: string, id: number, orgId: number, orgName: string,text:string,isNoSource:boolean) => ({
  id: id,
  name: name + '_prompt',
  isNoSource,
  text,
  organization: {
    id: orgId,
    name: orgName,
  },
  changed: true,
});

export const getAllDefaultTyps = (name: string, id: number, botId: string, orgId: number, orgName: string) => ({
  category: getDefaultCategory(name, id, botId) as never as TCategore,
  prompt: getDefaultPrompt(name, id, botId, orgId, orgName) as unknown as TPromt,
  file: getDefaultFile(name, id, botId, orgId, orgName) as unknown as TFile,
});

 export const  getFilePayload = (file: TFile, botId: string | number) => {
  const formData = new FormData();
  const blob = new Blob([file.file.data], {
    type: 'text/plain',
  });
  formData.set('name', file.name);
  formData.set('file', blob);
  formData.set('botId', String(botId));
  formData.set('organizationId', String(file.organization.id));
  formData.set('extension', file.extension);
  return formData;
};

export const getPromptPayload = (prompt: TPromt, botId: string | number) => ({
  name: prompt.name,
  isNoSource: false,
  text: prompt.text,
  botId: botId,
  organizationId: prompt.organization.id,
});

const getCategoryPayload = (
  category: TCategore,
  botId: string | number,
  fileId: number | undefined,
  promptId: number | undefined,
  extension: string | undefined,
) => ({
  name: category.name,
  botId,
  languageCode: category.languageCode || 'en',
  remark: category.remark || '',
  fileId,
  preprocessor: category.preprocessor || 'lambda data: data',
  threshold: category.threshold || 1,
  thresholdSensitive:  category.thresholdSensitive || '',
  kNum:  category.kNum || 5,
  promptId,
  ignoreHistory: category.ignoreHistory || false,
  addToHistory: category.addToHistory || true,
  design: category.design || 'default',
  splitterType: extension === 'txt' ? 'split_by_separator' : 'split_csv_by_template',
  splitterConfig: category.splitterConfig || '',
});
const getCategoryPartialPayload = (category: TCategore, fileId?: number, promptId?: number) => ({
  splitterConfig: category.splitterConfig,
  threshold: category.threshold,
  kNum: category.kNum,
  name: category.name,
  fileId,
  promptId,
});

export const categoryPartialPayloadPut = (
  category: TCategore,
) => ({
  splitterConfig: category.splitterConfig,
  threshold: category.threshold,
  kNum: category.kNum,
  name: category.name,
  languageCode: category.languageCode,
  remark: category.remark,
  
  preprocessor: category.preprocessor || 'lambda data: data',
  
  thresholdSensitive:  category.thresholdSensitive || '',
 
  ignoreHistory: category.ignoreHistory || false,
  addToHistory: category.addToHistory || true,
  design: category.design || 'default',
  splitterType: category.splitterType,
  fileId:category.file?.id,
  promptId:category.prompt?.id,
});

export const createChainFunc = (
  category: TCategore,
  prompt: TPromt | undefined,
  file: TFile | undefined,
  bot: BotFull,
): (() => Promise<void>) => {
  
  return async function () {
    let fileCreated  = {data:file};
    let promptCreated = {data:prompt}
    if(file && file.id<0){
      const filePaylad = getFilePayload(file, bot.recordId);
      fileCreated = await postFiles(filePaylad);
    }
    if(prompt && prompt.id<0){
      const promptPaylad = getPromptPayload(prompt, bot.recordId);
      promptCreated = await postPrompt(promptPaylad);
    }

    const categoryPaylad = getCategoryPayload(
      category,
      bot.recordId,
      fileCreated?.data?.id,
      promptCreated?.data?.id,
      file?.extension,
    );
    await postCategore(categoryPaylad);
  };
};
export const createPartialChainFunc = (
  bot: BotFull,
  category: TCategore,
  prompt?: TPromt,
  file?: TFile,
): (() => Promise<void>) => {
  const filePaylad = file ? getFilePayload(file, bot.recordId) : null;
  const promptPaylad = prompt ? getPromptPayload(prompt, bot.recordId) : null;
  return async function () {
    const fileCreated = filePaylad ? await postFiles(filePaylad) : undefined;
    const promptCreated = promptPaylad ? await postPrompt(promptPaylad) : undefined;
    const categoryPaylad = getCategoryPartialPayload(category, fileCreated?.data?.id, promptCreated?.data?.id);
    await putCategore(category.id, categoryPaylad);
  };
};

export const checkBelongFileToCategory = (category: TCategore[],fileId?: number,):boolean=>{
  const index = category.findIndex(el=>el.file?.id === fileId);
  return index>-1
}
export const checkBelongPromptToCategory = (category: TCategore[],promptId?: number,):boolean=>{
  const index = category.findIndex(el=>el.file?.id === promptId);
  return index>-1
}

export const makeSplitterConfig = (fields: ISplitterConfig) => {
  const template = fields.template
    .filter((el) => el !== '')
    .map((f) => `{${f}}`)
    .join('\n');
  const output = fields.metadatas.output
    .filter((el) => el !== '')
    .map((f) => `${toPascalCase(f)}:{${f}}`)
    .join('\n');
  return JSON.stringify({
    iterator: fields.iterator,
    template,
    metadatas: {
      output,
      h_output: output,
      h_template: `{${fields.iterator}}`,
    },
  });
};

export const toPascalCase = (value: string) => {
  return value
    .replace(/[-_ ]*([A-Z])/g, function (match, group1) {
      return ' ' + group1;
    })
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};

export const createSplitterConfig = (spliter: string): ISplitterConfig => {
  const defaultSplitter: ISplitterConfig = {
    iterator: '',
    template: [],
    metadatas: {
      output: [],
      h_output: [],
      h_template: [],
    },
  };
  const spliterClone = { ...defaultSplitter };
  if (spliter !== '') {
    try {
      const data = JSON.parse(spliter) as ISplitterConfigIncom;
      const re = /\{(.+?)\}/g;

      spliterClone.iterator = data.iterator;
      const tempplate = data.template as string;
      spliterClone.template =
        tempplate
          .match(re)
          ?.map((el) => el.replace(/{(.*)}/, '$1'))
          .map((el) => {
            if (el === 'i') return spliterClone.iterator;
            return el;
          }) || ([] as string[]);
      spliterClone.metadatas.output =
        data.metadatas.output
          .match(re)
          ?.map((el) => el.replace(/{(.*)}/, '$1'))
          .map((el) => {
            if (el === 'i') return spliterClone.iterator;
            return el;
          }) || ([] as string[]);

      return spliterClone;
    } catch (err) {
      return spliterClone;
    }
  } else {
    return spliterClone;
  }
};

// export const getDefaultSettingsForChatDialog = (): TWidgetDesign => ({
//   headerColor: 'rgb(28, 73, 102)',
//   headerColorText: 'rgb(255, 255, 255)',
//   titleFontSize: 16,
//   closeButtonColor: 'rgb(28, 73, 102)',
//   //DIALOG
//   backgroundColor: 'rgb(255, 255, 255)',
//   fontSize: 16,
//   agentMessageBackgroundColor: 'rgb(220, 220, 220)',
//   agentMessageTextColor: 'rgb(0, 0, 0)',
//   userMessageBackgroundColor: 'rgb(224, 247, 250)',
//   userMessageTextColor: 'rgb(0, 0, 0, 1)',
//
//   inputBackgroundColor: 'rgb(245, 247, 249)',
//   inputTextColor: 'rgb(0, 0, 0)',
//   buttonBackgroundColor: 'rgb(31, 31, 31)',
//   buttonTextColor: 'rgb(255, 255, 255)',
//   widgetRoundCorners: 20,
//   sendButtonRoundCorner: 20,
//   widgetPosition: 'rightBottom',
//   agentName: '',
//   shadow: false,
//   verticalMargin: 24,
//   horizontalMargin: 24,
//   width: 350,
//   height: 600,
//   inputPlaceholder: 'Enter placeholder',
//   logoMimeType: '',
// });
export const getDefaultSettingsForChatDialog = (): TWidgetDesign => ({
  headerColor: 'rgb(246, 249, 255)',
  headerColorText: 'rgb(31, 31, 31)',
  titleFontSize: 16,
  closeButtonColor: 'rgb(0, 0, 0)',
  //DIALOG
  backgroundColor: 'rgb(255, 255, 255)',
  fontSize: 16,
  agentMessageBackgroundColor: 'rgb(245, 247, 249)',
  agentMessageTextColor: 'rgb(31, 31, 31)',
  userMessageBackgroundColor: 'rgb(84, 121, 247)',
  userMessageTextColor: 'rgb(255, 255, 255)',

  inputBackgroundColor: 'rgb(245, 247, 249)',
  inputTextColor: 'rgb(0, 0, 0)',
  buttonBackgroundColor: 'rgb(31, 31, 31)',
  buttonTextColor: 'rgb(255, 255, 255)',
  widgetRoundCorners: 20,
  sendButtonRoundCorner: 20,
  widgetPosition: 'rightBottom',
  agentName: '',
  shadow: false,
  verticalMargin: 24,
  horizontalMargin: 24,
  width: 350,
  height: 600,
  inputPlaceholder: 'Enter placeholder',
  logoMimeType: '',
});
