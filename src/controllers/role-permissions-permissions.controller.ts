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
  RolePermissions,
  Permissions,
} from '../models';
import {RolePermissionsRepository} from '../repositories';

export class RolePermissionsPermissionsController {
  constructor(
    @repository(RolePermissionsRepository) protected rolePermissionsRepository: RolePermissionsRepository,
  ) { }

  @get('/role-permissions/{id}/permissions', {
    responses: {
      '200': {
        description: 'RolePermissions has one Permissions',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permissions),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Permissions>,
  ): Promise<Permissions> {
    return this.rolePermissionsRepository.permissions(id).get(filter);
  }

  @post('/role-permissions/{id}/permissions', {
    responses: {
      '200': {
        description: 'RolePermissions model instance',
        content: {'application/json': {schema: getModelSchemaRef(Permissions)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof RolePermissions.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {
            title: 'NewPermissionsInRolePermissions',
            exclude: ['_id'],
            optional: ['rolePermissionsId']
          }),
        },
      },
    }) permissions: Omit<Permissions, '_id'>,
  ): Promise<Permissions> {
    return this.rolePermissionsRepository.permissions(id).create(permissions);
  }

  @patch('/role-permissions/{id}/permissions', {
    responses: {
      '200': {
        description: 'RolePermissions.Permissions PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {partial: true}),
        },
      },
    })
    permissions: Partial<Permissions>,
    @param.query.object('where', getWhereSchemaFor(Permissions)) where?: Where<Permissions>,
  ): Promise<Count> {
    return this.rolePermissionsRepository.permissions(id).patch(permissions, where);
  }

  @del('/role-permissions/{id}/permissions', {
    responses: {
      '200': {
        description: 'RolePermissions.Permissions DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Permissions)) where?: Where<Permissions>,
  ): Promise<Count> {
    return this.rolePermissionsRepository.permissions(id).delete(where);
  }
}
