import {BindingKey} from '@loopback/core';
import {HashService} from '../services';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'secret';
  export const Token_Expires_In_Value = 60;
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<number>(
    'authentication.jwt.expiresIn',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<HashService>('service.hash')
}


export namespace AuthenticationServiceBindings {
  export const ROUNDS = BindingKey.create<number>('rounds')
}

export namespace AuthenticationServiceConstants {
  export const ROUNDS = 10;
}
