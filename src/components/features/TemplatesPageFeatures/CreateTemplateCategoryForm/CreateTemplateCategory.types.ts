export interface TApplyCreateTemplateCategory {
  name: string;
  description: string;
  image: Blob;
}
export interface CreateTemplateCategoryProps {
  onClose: () => void;
  onApply: (param: Partial<FormData>) => void;
}
