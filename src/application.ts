import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {HashService} from './services';
import {AuthenticationServiceBindings, AuthenticationServiceConstants, PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants} from './BindingKeys';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {JwtStrategy} from './authenticationStrategy/jwtStrategy';

export {ApplicationConfig};

export class LbProdApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //set up Bindings
    this.setupBindings();
    // Set up the custom sequence

    //register authentication component
    this.component(AuthenticationComponent)
    registerAuthenticationStrategy(this, JwtStrategy);
    
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBindings(): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(HashService);
    this.bind(AuthenticationServiceBindings.ROUNDS).to(AuthenticationServiceConstants.ROUNDS);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.Token_Expires_In_Value);
  }
}
