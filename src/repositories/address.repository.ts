import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Address, AddressRelations} from '../models';

export class AddressRepository extends DefaultCrudRepository<
  Address,
  typeof Address.prototype.id,
  AddressRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Address, dataSource);
  }
}
