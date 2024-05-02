import {HttpErrors, api, getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {PasswordHasher, RegisterProps} from '../types';
import {UserRepository} from '../repositories';
import {AuthenticationService, ErrorProvider, JwtService, ValidatorProvider, errorProvider, validationProvider} from '../services';
import {PasswordHasherBindings} from '../BindingKeys';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {User} from '../models';
import {PermissionKeys} from '../enums';

@api({
  basePath: '/admin'
})
export class AdminController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @service(ErrorProvider) private errorService: errorProvider,
    @service(ValidatorProvider) private validationService: validationProvider,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private hashService: PasswordHasher,
    @service(AuthenticationService)
    private authenticationService: AuthenticationService,
    @service(JwtService) private jwtService: JwtService,
  ) {}

  @post('/create', {
    responses: {
      '200': {
        description: 'user',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async create(
    @requestBody({
      description: 'signup form paramters',
      required: true,
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'firstName', 'lastName'],
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              firstName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    admin: RegisterProps,
  ) {
    const {email, password, firstName, lastName} = admin;
    try {
      await this.validationService.validateEmail(email);
      await this.validationService.validatePassword(password);
    } catch (e) {
      throw this.errorService.emailValidationFailure();
    }
    try {
      admin.permissions = [PermissionKeys.CreateJob, PermissionKeys.UpdateJob, PermissionKeys.DeleteJob].join();
      const hashPassword = await this.hashService.hashPassword(password);
      const data = await this.userRepository.create({
        email: admin.email,
        password: hashPassword,
        firstName: admin.firstName,
        lastName: admin.lastName,
        permissions: admin.permissions
      });
      return data;
    } catch (e) {
      throw HttpErrors.BadRequest();
    }
  }
}
