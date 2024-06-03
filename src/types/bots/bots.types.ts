import { TOrgOwner } from 'types';

export type BotShort = {
  id: number;
  name: string;
  createdDate: string;
  modifiedDate: string;
  organizationId: number;
  organization: {
    id: number;
    name: string;
  };
};

export type TWidgetDesign = {
  headerColor: string;
  headerColorText: string;
  titleFontSize: number;
  closeButtonColor: string;
  backgroundColor: string;
  fontSize: number;
  agentMessageBackgroundColor: string;
  agentMessageTextColor: string;
  userMessageBackgroundColor: string;
  userMessageTextColor: string;
  inputBackgroundColor: string;
  inputTextColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  widgetRoundCorners: number;
  sendButtonRoundCorner: number;
  widgetPosition: string;
  agentName: string;
  shadow: boolean;
  verticalMargin: number;
  horizontalMargin: number;
  width: number;
  height: number;
  inputPlaceholder: string;
  logoMimeType: string;
};

export type BotFull = {
  id: string;
  recordId: number;
  createdDate: string;
  modifiedDate: string;
  botPrompt: string;
  name: string;
  language: string;
  greeting: string;
  useContext: boolean;
  useRemarks: boolean;
  useHistory: boolean;
  phone: string;
  llmModelId: string;
  organization: {
    id: number;
    name: string;
  };
  prompt: {
    id: number;
    name: string;
    text: string;
    isNoSource: boolean;
  };
  file: {
    id: number;
    name: string;
    text: string;
    isNoSource: boolean;
    extension: string;
  };
  category: {
    id: number;
    name: string;
    languageCode: string;
    remark: string;
    preprocessor: string;
    splitterType: string;
    splitterConfig: string;
    threshold: number;
    thresholdSensitive: string;
    kNum: number;
    ignoreHistory: boolean;
    addToHistory: boolean;
    design: string;
  };
  owner: TOrgOwner;
  widgetDesign: TWidgetDesign | string;
  widgetLogo: ArrayBuffer;
};

export type TBotFields = {
  id?: number;
  name: string;
  organizationId: number;
  greeting: string;
  prompt: string;
  language: string;
  useContext: boolean;
  useRemarks: boolean;
  useHistory: boolean;
};
