import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    mysql: {
      table: 'address'
    }
  }
})
export class Address extends Entity {
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
  city: string;

  @property({
    type: 'number',
  })
  zip?: number;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'number',
  })
  studentId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

export interface AddressRelations {
  // describe navigational properties here
}

export type AddressWithRelations = Address & AddressRelations;
