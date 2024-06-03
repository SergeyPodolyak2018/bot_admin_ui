import { ITemplate } from '../../../../pages/TemplatesPage/TemplatesPage.types.ts';

export interface TApplyEditBot {
  id: number;
  typeId: number;
  description: string;
  isActive: boolean;
}

export interface EditTemplateFormProps {
  onClose: () => void;
  onApply: (param: TApplyEditBot) => void;
  template: ITemplate;
}
