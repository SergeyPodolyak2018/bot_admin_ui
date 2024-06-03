import { BotShort, TOrganisation, TOrganisationPayload, TOrganisationAssignUsersPayload } from 'types';

export type PostOrganisationResponse = BotShort[];
export type PutOrganizationResponse = BotShort;

export type GetOrganisationsResponse = TOrganisation[];
export type PostOrganisationPayload = TOrganisationPayload;
export type PostOrganisationAssignUserPayload = TOrganisationAssignUsersPayload;
