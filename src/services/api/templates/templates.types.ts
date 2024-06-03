import { TTemplate, TTemplateTypes, TCreateCategoryTemplate, TCreateCategoryTemplateResp } from 'types';
import { TApplyCreateBot } from '../../../components/features/TemplatesPageFeatures/CreateNewTemplateForm/CreateNewTemplate.types.ts';
import { TApplyEditBot } from '../../../components/features/TemplatesPageFeatures/EditTemplateForm/EditTemplate.types.ts';

export type GetTemplateResponse = TTemplateTypes[];
export type GetTemplateByTypeResponse = TTemplate[];
export type PostCreateCategoryTemplatePayload = TCreateCategoryTemplate;
export type PostCreateCategoryTemplateResp = TCreateCategoryTemplateResp;

export type PostCreateTemplateCategoryFormResp = TCreateCategoryTemplateResp;

export type PostCreateTemplateFormPayload = TApplyCreateBot;
export type PostCreateTemplateFormResp = any;

export type PostEditTemplateFormPayload = TApplyEditBot;
export type PostEditTemplateFormResp = any;
