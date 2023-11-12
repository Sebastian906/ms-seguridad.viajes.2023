import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {RolePermissions} from '../models';
import {PermissionsRoleMenuRepository} from '../repositories';

export class PermissionsRoleMenuController {
  constructor(
    @repository(PermissionsRoleMenuRepository)
    public permissionsRoleMenuRepository: PermissionsRoleMenuRepository,
  ) {}

  @post('/role-menu')
  @response(200, {
    description: 'RolePermissions model instance',
    content: {'application/json': {schema: getModelSchemaRef(RolePermissions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermissions, {
            title: 'NewPermissionsRoleMenu',
            exclude: ['_id'],
          }),
        },
      },
    })
    RolePermissions: Omit<RolePermissions, '_id'>,
  ): Promise<RolePermissions> {
    return this.permissionsRoleMenuRepository.create(RolePermissions);
  }

  @get('/role-menu/count')
  @response(200, {
    description: 'RolePermissions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RolePermissions) where?: Where<RolePermissions>,
  ): Promise<Count> {
    return this.permissionsRoleMenuRepository.count(where);
  }

  @get('/role-menu')
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
    return this.permissionsRoleMenuRepository.find(filter);
  }

  @patch('/role-menu')
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
    RolePermissions: RolePermissions,
    @param.where(RolePermissions) where?: Where<RolePermissions>,
  ): Promise<Count> {
    return this.permissionsRoleMenuRepository.updateAll(RolePermissions, where);
  }

  @get('/role-menu/{id}')
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
    @param.filter(RolePermissions, {exclude: 'where'})
    filter?: FilterExcludingWhere<RolePermissions>,
  ): Promise<RolePermissions> {
    return this.permissionsRoleMenuRepository.findById(id, filter);
  }

  @patch('/role-menu/{id}')
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
    RolePermissions: RolePermissions,
  ): Promise<void> {
    await this.permissionsRoleMenuRepository.updateById(id, RolePermissions);
  }

  @put('/role-menu/{id}')
  @response(204, {
    description: 'RolePermissions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() RolePermissions: RolePermissions,
  ): Promise<void> {
    await this.permissionsRoleMenuRepository.replaceById(id, RolePermissions);
  }

  @del('/role-menu/{id}')
  @response(204, {
    description: 'RolePermissions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.permissionsRoleMenuRepository.deleteById(id);
  }
}
