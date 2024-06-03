import { ITemplateCategory } from '../../../../pages/TemplatesPage/TemplatesPage.types.ts';

export interface EditTemplateCategoryProps {
  templateType: ITemplateCategory;
  onClose: () => void;
  onApply: (id: number, param: Partial<FormData>) => void;
}
