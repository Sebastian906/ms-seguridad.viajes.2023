import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {RolePermissions} from '../models';
import {RolePermissionsRepository} from '../repositories';

export class RolePermissionsController {
  constructor(
    @repository(RolePermissionsRepository)
    public rolePermissionsRepository : RolePermissionsRepository,
  ) {}

  @post('/role-permissions')
  @response(200, {
    description: 'RolePermissions model instance',
    content: {'application/json': {schema: getModelSchemaRef(RolePermissions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermissions, {
            title: 'NewRolePermissions',
            exclude: ['_id'],
          }),
        },
      },
    })
    rolePermissions: Omit<RolePermissions, '_id'>,
  ): Promise<RolePermissions> {
    return this.rolePermissionsRepository.create(rolePermissions);
  }

  @get('/role-permissions/count')
  @response(200, {
    description: 'RolePermissions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RolePermissions) where?: Where<RolePermissions>,
  ): Promise<Count> {
    return this.rolePermissionsRepository.count(where);
  }

  @get('/role-permissions')
  @response(200, {
    description: 'Array of RolePermissions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RolePermissions, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RolePermissions) filter?: Filter<RolePermissions>,
  ): Promise<RolePermissions[]> {
    return this.rolePermissionsRepository.find(filter);
  }

  @patch('/role-permissions')
  @response(200, {
    description: 'RolePermissions PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermissions, {partial: true}),
        },
      },
    })
    rolePermissions: RolePermissions,
    @param.where(RolePermissions) where?: Where<RolePermissions>,
  ): Promise<Count> {
    return this.rolePermissionsRepository.updateAll(rolePermissions, where);
  }

  @get('/role-permissions/{id}')
  @response(200, {
    description: 'RolePermissions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RolePermissions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RolePermissions, {exclude: 'where'}) filter?: FilterExcludingWhere<RolePermissions>
  ): Promise<RolePermissions> {
    return this.rolePermissionsRepository.findById(id, filter);
  }

  @patch('/role-permissions/{id}')
  @response(204, {
    description: 'RolePermissions PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermissions, {partial: true}),
        },
      },
    })
    rolePermissions: RolePermissions,
  ): Promise<void> {
    await this.rolePermissionsRepository.updateById(id, rolePermissions);
  }

  @put('/role-permissions/{id}')
  @response(204, {
    description: 'RolePermissions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() rolePermissions: RolePermissions,
  ): Promise<void> {
    await this.rolePermissionsRepository.replaceById(id, rolePermissions);
  }

  @del('/role-permissions/{id}')
  @response(204, {
    description: 'RolePermissions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.rolePermissionsRepository.deleteById(id);
  }
}
