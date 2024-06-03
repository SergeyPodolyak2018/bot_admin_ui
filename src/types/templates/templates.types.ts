export type TTemplateTypes = {
  id: number;
  name: string;
  description: string;
  image: string;
  templateCount: number;
};
export type TTemplateTypesUI = {
  id: number;
  name: string;
  description: string;
  image: string;
  templateCount: number;
};

export type TTemplate = {
  id: number;
  typeId: number;
  bot: {
    id: number;
    name: string;
  };
  description: string;
  isActive: boolean;
};

export type TCreateCategoryTemplate = {
  templateId: number;
  organizationId: number;
};
export type TCreateCategoryTemplateResp = {
  createdDate: string;
  greeting: string;
  id: number;
  languag: string;
  modifiedDate: string;
  name: string;
  organizationId: number;
  ownerId: number;
  templateId: number;
  useContext: boolean;
  useHistory: boolean;
  useRemarks: boolean;
};

export type TEditTemplate = {
  id: number;
  typeId: number;
  description: string;
  isActive: boolean;
};
export type TEditTemplateResp = any;

export type TCreateTemplateCategory = {
  name: string;
  description: string;
  image: Blob | string;
};

export type TEditTemplateCategory = {
  id: number;
  name: string;
  description: string;
  image: string;
};
