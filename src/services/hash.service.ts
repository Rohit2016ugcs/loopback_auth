import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import {PasswordHasher} from '../types';
import bcrypt from 'bcryptjs';

@injectable({scope: BindingScope.TRANSIENT})
export class HashService implements PasswordHasher<string> {
  constructor(
    @inject('rounds') private rounds: number
  ) { }
  async hashPassword(passsword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.rounds);
    return await bcrypt.hash(passsword, salt);
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

}
