export interface ITemplate {
  id: number;
  bot: {
    id: number;
    name: string;
  };
  isActive: boolean;
  description: string;
  typeId: number;
}

export interface ITemplateCategory {
  id: number;
  name: 'string';
  description: 'string';
  image: 'string';
  templateCount: number;
}
