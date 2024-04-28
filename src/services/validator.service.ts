import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';
import * as yup from 'yup'
/*
 * Fix the service type. Possible options can be:
 * - import {Validator} from 'your-module';
 * - export type Validator = string;
 * - export interface Validator {}
 */
export type Validator = unknown;

export type validationProvider = {
  validateEmail(email: string): Promise<any>;
  validatePassword(password: string): Promise<any>;
}

@injectable({scope: BindingScope.TRANSIENT})
export class ValidatorProvider implements Provider<Validator> {
  constructor() {}

  value(): validationProvider  {
    return {
      validateEmail: (email: string): Promise<any> => {
        const emailSchema = yup.string().email('invalid email');
        return emailSchema.validate(email);
      },
      validatePassword: (password: string): Promise<any> => {
        const passwordSchema = yup.string().strip().min(8).max(15);
        return passwordSchema.validate(password);
      }
    }
  }
}
