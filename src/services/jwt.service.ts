import {injectable, /* inject, */ BindingScope, service, inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import jwt from 'jsonwebtoken';
import {ErrorProvider, errorProvider} from './error.service';
import {TokenServiceBindings, TokenServiceConstants} from '../BindingKeys';
import * as _ from 'lodash';
import {MyUserProfile} from '../types';

interface JwtInterface {
  generateToken(userProfile: UserProfile): Promise<string>
}

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService implements JwtInterface {
  constructor(
    @service(ErrorProvider) private errorService: errorProvider,
    @inject(TokenServiceBindings.TOKEN_SECRET) private readonly jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private readonly jwtExpiry: number
  ) {}
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw this.errorService.authValidationFailure('Error while generating token : user profile is null');
    }
    try {
      const token = await jwt.sign(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiry
      });
      return token
    } catch (e) {
      throw this.errorService.authValidationFailure(`error generating token ${e}`)
    }
  }

  async verifyToken(token: string): Promise<UserProfile | undefined | any> {
    if (!token) {
      throw this.errorService.authValidationFailure(
        `Error verifying token: 'token' is null`
      );
    }
    let userProfile: MyUserProfile;
    try {
      const decryptedToken = await jwt.verify(token, TokenServiceConstants.TOKEN_SECRET_VALUE);
      userProfile = _.pick(decryptedToken, ['name', 'email', 'permissions']) as MyUserProfile;
      return userProfile
    } catch (e) {
      throw this.errorService.authValidationFailure(`failed to verify token:- ${e}`)
    }
    return userProfile;
  }

}
