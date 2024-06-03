import { TOrganisation } from 'types/organisation';

export type IPrivileges = {
  id: number;
  entity: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export type IRole = {
  id: number;
  name: string;
  privileges: IPrivileges[];
};

export type UserShort = {
  email: string;
  lastName: string;
  firstName: string;
};
export type User = {
  avatar: string;
  avatarMime: string;
  name: string;
  customerId?: string;
  email: string;
  id: number;
  balance: number;
  accessToken: string;
  createdDate: string;
  modifiedDate: string;
  role: null | IRole;
  lastName: string;
  firstName: string;
  organizations: TOrganisation[];
  expertMode: boolean;
};

export type UserRegistration = {
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegistrationPayload = {
  email: string;
  password: string;
};

// export type UpdateUserPayload = {
//   name: string;
//   oldPassword: string;
//   newPassword: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   balance: number;
//   customerId: string;
//   roleId: number;
//   avatarMime: string;
//   avatar: string;
// };
