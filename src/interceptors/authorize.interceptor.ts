import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication';
import {
  Getter,
  /* inject, */
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  service,
  ValueOrPromise,
} from '@loopback/core';
import {MyUserProfile, RequiredPermissions} from '../types';
import * as _ from 'lodash';
import {ErrorProvider, errorProvider} from '../services';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metaData: AuthenticationMetadata[],
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
    @service(ErrorProvider) public errorService: errorProvider
  ){}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      console.log('log from authorize global interceptor')
      console.log(JSON.stringify(this.metaData))
      // if you don't provide options in your @authenticate decorator
      // this line will be executed
      if (!this.metaData) return await next();
      const requiredPermissions = this.metaData[0].options as RequiredPermissions
      console.log(requiredPermissions);
      //check the user permissions
      const user = await this.getCurrentUser();
      const intersectionResults = _.intersection(user.permissions?.split(','), requiredPermissions.required);
      if (intersectionResults.length != requiredPermissions.required.length) {
        throw this.errorService.authValidationFailure('INVALID ACCESS PERMISSIONS');
      }
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
