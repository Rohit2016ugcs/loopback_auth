import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {Request, RedirectRoute} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {AuthenticationService, ErrorProvider, JwtService, errorProvider} from '../services';

export class JwtStrategy implements AuthenticationStrategy {
  name: string = 'jwt';
  constructor(
    @service(JwtService) private jwtService: JwtService,
    @service(ErrorProvider) private errorService: errorProvider
  ) { }
  async authenticate(
    request: Request,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    const { token } = this.extractToken(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return Promise.resolve(userProfile);
  }

  extractToken(request: Request): {token: string} {
    if (!request.headers.authorization) {
      throw this.errorService.authValidationFailure('authrization header missing in request!!!')
    }
    const authHeader = request.headers.authorization;
    const token = authHeader.split('Bearer ');
    if (token.length !== 2) {
      throw this.errorService.authValidationFailure('token syntax incorrect must be of Bearer xxxx')
    }
    return { token: token[1] }
  }
}
