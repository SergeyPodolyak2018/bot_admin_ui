import { ITemplate, ITemplateCategory } from '../../pages/TemplatesPage/TemplatesPage.types.ts';

export type TemplatesData = {
  categories: ITemplateCategory[];
  templates: ITemplate[];
  loadingTemplates: boolean;
  loadingTypes: boolean;
};
