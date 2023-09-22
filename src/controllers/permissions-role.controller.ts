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
Permissions,
RolePermissions,
Role,
} from '../models';
import {PermissionsRepository} from '../repositories';

export class PermissionsRoleController {
  constructor(
    @repository(PermissionsRepository) protected permissionsRepository: PermissionsRepository,
  ) { }

  @get('/permissions/{id}/roles', {
    responses: {
      '200': {
        description: 'Array of Permissions has many Role through RolePermissions',
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
    return this.permissionsRepository.roles(id).find(filter);
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
            title: 'NewRoleInPermissions',
            exclude: ['_id'],
          }),
        },
      },
    }) role: Omit<Role, '_id'>,
  ): Promise<Role> {
    return this.permissionsRepository.roles(id).create(role);
  }

  @patch('/permissions/{id}/roles', {
    responses: {
      '200': {
        description: 'Permissions.Role PATCH success count',
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
    role: Partial<Role>,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.permissionsRepository.roles(id).patch(role, where);
  }

  @del('/permissions/{id}/roles', {
    responses: {
      '200': {
        description: 'Permissions.Role DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.permissionsRepository.roles(id).delete(where);
  }
}
