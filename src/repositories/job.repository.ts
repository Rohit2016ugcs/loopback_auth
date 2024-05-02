import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Job, JobRelations} from '../models';

export class JobRepository extends DefaultCrudRepository<
  Job,
  typeof Job.prototype.id,
  JobRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Job, dataSource);
  }
}
