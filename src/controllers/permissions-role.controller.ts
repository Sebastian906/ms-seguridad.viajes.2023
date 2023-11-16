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
import {Permissions, Role} from '../models';
import {PermissionsRepository} from '../repositories';

export class permissionsRoleController {
  constructor(
    @repository(PermissionsRepository)
    protected menuRepository: PermissionsRepository,
  ) {}

  @get('/permissions/{id}/roles', {
    responses: {
      '200': {
        description:
          'Array of permissions has many Role through Rolepermissions',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.menuRepository.roles(id).find(filter);
  }

  @post('/permissions/{id}/roles', {
    responses: {
      '200': {
        description: 'create a Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Permissions.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRoleInpermissions',
            exclude: ['_id'],
          }),
        },
      },
    })
    rol: Omit<Role, '_id'>,
  ): Promise<Role> {
    return this.menuRepository.roles(id).create(rol);
  }

  @patch('/permissions/{id}/roles', {
    responses: {
      '200': {
        description: 'permissions.Role PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    rol: Partial<Role>,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.menuRepository.roles(id).patch(rol, where);
  }

  @del('/permissions/{id}/roles', {
    responses: {
      '200': {
        description: 'permissions.Role DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.menuRepository.roles(id).delete(where);
  }
}
