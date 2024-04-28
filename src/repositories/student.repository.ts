import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Student, StudentRelations, Department, Address} from '../models';
import {DepartmentRepository} from './department.repository';
import {AddressRepository} from './address.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly department: BelongsToAccessor<Department, typeof Student.prototype.id>;

  public readonly address: HasOneRepositoryFactory<Address, typeof Student.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('DepartmentRepository') protected departmentRepositoryGetter: Getter<DepartmentRepository>, @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>,
  ) {
    super(Student, dataSource);
    this.address = this.createHasOneRepositoryFactoryFor('address', addressRepositoryGetter);
    this.registerInclusionResolver('address', this.address.inclusionResolver);
    this.department = this.createBelongsToAccessorFor('department', departmentRepositoryGetter,);
    this.registerInclusionResolver('department', this.department.inclusionResolver);
  }
}
