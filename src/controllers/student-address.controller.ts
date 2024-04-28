import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Student,
  Address,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentAddressController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/address', {
    responses: {
      '200': {
        description: 'Student has one Address',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Address),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address> {
    return this.studentRepository.address(id).get(filter);
  }

  @post('/students/{id}/address', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddressInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) address: Omit<Address, 'id'>,
  ): Promise<Address> {
    return this.studentRepository.address(id).create(address);
  }

  @patch('/students/{id}/address', {
    responses: {
      '200': {
        description: 'Student.Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Partial<Address>,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.studentRepository.address(id).patch(address, where);
  }

  @del('/students/{id}/address', {
    responses: {
      '200': {
        description: 'Student.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.studentRepository.address(id).delete(where);
  }
}
