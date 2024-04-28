export type RegisterProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}


export interface PasswordHasher<T=string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(password: T, hash: T): Promise<boolean>;
}


export type LoginProps = {
  email: string;
  password: string;
}

