export const categoryFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
  },
  {
    name: 'languageCode',
    type: 'text',
    label: 'Language Code',
  },
  {
    name: 'remark',
    type: 'text',
    label: 'Remark',
  },

  {
    name: 'preprocessor',
    type: 'text',
    label: 'Preprocessor',
    multiline: true,
    rows: 4,
  },
  {
    name: 'splitterType',
    type: 'text',
    label: 'Splitter Type',
    multiline: true,
    rows: 4,
  },
  {
    name: 'splitterConfig',
    type: 'text',
    label: 'Splitter Config',
    multiline: true,
    rows: 10,
  },
  {
    name: 'threshold',
    type: 'number',
    label: 'Threshold',
  },
  {
    name: 'thresholdSensitive',
    type: 'text',
    label: 'Threshold Sensitive',
  },
  {
    name: 'kNum',
    type: 'number',
    label: 'k Num',
  },

  {
    name: 'ignoreHistory',
    type: 'boolean',
    label: 'Ignore History',
  },
  {
    name: 'addToHistory',
    type: 'boolean',
    label: 'Add To History',
  },
];

export const categoryFieldsSpecial = [
  {
    name: 'promptId',
    type: 'number',
    label: 'Prompt Id',
  },
  {
    name: 'fileId',
    type: 'number',
    label: 'File Id',
  },
];

export const promtFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
  },
  {
    name: 'text',
    type: 'text',
    label: 'Text',
    multiline: true,
    rows: 10,
    preprocessor: true,
    skip: true,
  },
  {
    name: 'isNoSource',
    type: 'boolean',
    label: 'Is No Source',
  },
];

export const botFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
  },
  {
    name: 'organizationId',
    type: 'number',
    label: 'Organisation Id',
    skip: true,
  },
  {
    name: 'greeting',
    type: 'string',
    label: 'Welcome Message',
    multiline: true,
    rows: 2,
  },
  {
    name: 'prompt',
    type: 'string',
    label: 'Prompt',
    multiline: true,
    rows: 8,
  },
  {
    name: 'language',
    type: 'string',
    label: 'Language Code',
  },
  {
    name: 'useContext',
    type: 'boolean',
    label: 'Use Context',
  },
  {
    name: 'useRemarks',
    type: 'boolean',
    label: 'Use Remarks',
  },
  {
    name: 'useHistory',
    type: 'boolean',
    label: 'Use History',
  },
  {
    name: 'file',
    type: 'file',
    label: 'File name',
  },
];

export const inputStyle = {
  width: '90%',
  marginTop: '10px',
};
