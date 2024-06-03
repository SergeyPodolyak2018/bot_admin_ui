export type TOrganisation = {
  id: number;
  name: string;
  users: TOrganisationMember[];
  owner: TOrgOwner;
  botCount: number;
  balance: number;
  billingDate: string;
  billingPlanId: number;
};

export type TOrgOwner = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdDate: string;
  modifiedDate: string;
  organizations: string[];
};

export type TOrganisationMember = {
  createdDate: string;
  email: string;
  id: number;
  modifiedDate: string;
  name: string;
};

export type TOrganisationPayload = {
  id?: number;
  name: string;
};

export type TOrganisationAssignUsersPayload = {
  emails: string[];
};
