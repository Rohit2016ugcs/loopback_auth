import {Entity, model, property, hasMany} from '@loopback/repository';
import {Student} from './student.model';

@model({
  settings: {
    strict: false,
    mysql: {
      table: 'course'
    }
  }
})
export class Course extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @hasMany(() => Student)
  students: Student[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
