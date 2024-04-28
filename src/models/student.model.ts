import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Department} from './department.model';
import {Address} from './address.model';

@model({
  settings: {
    mysql: {
      table: 'student'
    }
  }
})
export class Student extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      columnName: 'firstname'
    }
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'number',
  })
  courseId?: number;

  @belongsTo(() => Department)
  departmentId: number;

  @hasOne(() => Address)
  address: Address;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
