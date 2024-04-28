import {injectable, /* inject, */ BindingScope, service, inject} from '@loopback/core';
import {UserService} from '@loopback/authentication';
import {User} from '../models';
import {LoginProps} from '../types';
import {UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {ErrorProvider, errorProvider} from './error.service';
import {HashService} from './hash.service';
import * as _ from 'lodash';
import {PasswordHasherBindings} from '../BindingKeys';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService implements UserService<Partial<User>, LoginProps> {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @service(ErrorProvider) private errorService: errorProvider,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) private hashService: HashService
  ) {}

  async verifyCredentials(credentials: LoginProps): Promise<Partial<User>> {
    const {email, password} = credentials;
    const user = await this.userRepository.findOne({
      where: {
        email: { eq: email }
      }
    })
    if (!user) {
      throw this.errorService.notFound(`user with email:- ${email} not found!!`)
    }
    const passwordMatched = await this.hashService.comparePassword(password, user.password);
    if (!passwordMatched) {
      throw this.errorService.authValidationFailure('incorrect credentials')
    }
    return _.pick(user, ['email', 'firstName', 'lastName']);
  }
  convertToUserProfile(user: Partial<User>): UserProfile {
    const userName = (user.firstName ?? '') + (user.lastName ?? '');
    return {
      id: `${user.id}`,
      name: userName
    };
  }
}
