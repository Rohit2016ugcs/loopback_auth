import {PermissionKeys} from '../enums';

export type RegisterProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  permissions: string;
}


export interface PasswordHasher<T=string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(password: T, hash: T): Promise<boolean>;
}


export type LoginProps = {
  email: string;
  password: string;
}

export interface RequiredPermissions {
  required: PermissionKeys
}


export interface MyUserProfile {
  id: string;
  email?: string;
  name: string;
  permissions: PermissionKeys
}
