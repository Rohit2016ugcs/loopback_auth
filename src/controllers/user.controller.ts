// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {HttpErrors, api, get, getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {User} from '../models';
import {LoginProps, PasswordHasher, RegisterProps} from '../types';
import {inject, service} from '@loopback/core';
import {AuthenticationService, ErrorProvider, HashService, JwtService, ValidatorProvider, errorProvider, validationProvider} from '../services';
import {PasswordHasherBindings} from '../BindingKeys';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {PermissionKeys} from '../enums';

// import {inject} from '@loopback/core';

@api({
  basePath: '/user',
})
export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @service(ErrorProvider) private errorService: errorProvider,
    @service(ValidatorProvider) private validationService: validationProvider,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) private hashService: PasswordHasher,
    @service(AuthenticationService) private authenticationService: AuthenticationService,
    @service(JwtService) private jwtService: JwtService
  ) {}

  @post('/signup', {
    responses: {
      '200': {
        description: 'user',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signup(
    @requestBody({
      description: 'signup form paramters',
      required: true,
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'firstName','lastName'],
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string'
              },
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              }
            }
          }
        }
      },
    })
    body: RegisterProps
  ) {
    const {email, password, firstName, lastName} = body;
    try {
      await this.validationService.validateEmail(email);
      await this.validationService.validatePassword(password);
    } catch (e) {
      throw this.errorService.emailValidationFailure()
    }
    try {
      body.permissions = [PermissionKeys.AccessAuthFeature].join();
      const hashPassword = await this.hashService.hashPassword(password);
      const data = await this.userRepository.create({
        email: body.email,
        password: hashPassword,
        firstName: body.firstName,
        lastName: body.lastName
      })
      return data;
    } catch (e) {
      throw HttpErrors.BadRequest()
    }
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'login route',
        content: {
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string' }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      description: 'login paramters',
      required: true,
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string'},
              password: { type: 'string' }
            }
          }
        }
      }
    })
    body: LoginProps
  ): Promise<Partial<User>> {
    const {email, password} = body;
    try {
      const user = await this.authenticationService.verifyCredentials({email, password})
      const userProfile = await this.authenticationService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken({
        email: user.email,
        name: userProfile.name,
        permissions: user.permissions,
        user
      })
      return {
        email,
        token
      }
    } catch (e) {
      throw HttpErrors.BadRequest(e.message);
    }
  }

  @get('/profile')
  @authenticate('jwt')
  async fetchProfile(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ) {
    return Promise.resolve(currentUser)
  }
}
