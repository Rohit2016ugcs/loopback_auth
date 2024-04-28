import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {ErrorType} from '../enums';

/*
 * Fix the service type. Possible options can be:
 * - import {Error} from 'your-module';
 * - export type Error = string;
 * - export interface Error {}
 */
export type Error = unknown;

export type errorProvider = {
  emailValidationFailure(msg?: string, name?: string): void;
  passwordValidationFailure(msg?: string, name?: string): void;
  authValidationFailure(msg?: string, name?: string): void;
  notFound(msg?: string, name?: string): void;
};

@injectable({scope: BindingScope.TRANSIENT})
export class ErrorProvider implements Provider<Error> {
  constructor() {}

  value(): errorProvider {
    return {
      emailValidationFailure: (msg?: string, name?: string) => {
        const error = new HttpErrors.BadRequest(msg ?? 'email validation failure')
        error.name = name ?? ErrorType.BAD_REQUEST
        return error;
      },
      passwordValidationFailure: (msg?: string, name?: string) => {
        const error = new HttpErrors.BadRequest(msg ?? 'password validation failure');
        error.name = name ?? ErrorType.BAD_REQUEST;
        return error;
      },
      authValidationFailure: (msg?: string, name?: string) => {
        const error = new HttpErrors.Unauthorized(msg ?? 'unauthorized');
        error.name = name ?? ErrorType.UNAUTHORIZED_REQUEST;
        return error;
      },
      notFound: (msg?: string, name?: string) => {
        const error = new HttpErrors.NotFound(msg ?? 'user not found');
        error.name = name ?? ErrorType.USER_NOT_FOUND;
        return error;
      }
    }
  }
}
