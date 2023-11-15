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
import {Permissions} from '../models';
import {PermissionsRepository} from '../repositories';

export class PermissionsController {
  constructor(
    @repository(PermissionsRepository)
    public permissionsRepository : PermissionsRepository,
  ) {}

  @post('/permissions')
  @response(200, {
    description: 'Permissions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Permissions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {
            title: 'NewPermissions',
            exclude: ['_id'],
          }),
        },
      },
    })
    permissions: Omit<Permissions, '_id'>,
  ): Promise<Permissions> {
    return this.permissionsRepository.create(permissions);
  }

  @get('/permissions/count')
  @response(200, {
    description: 'Permissions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Permissions) where?: Where<Permissions>,
  ): Promise<Count> {
    return this.permissionsRepository.count(where);
  }

  @get('/permissions')
  @response(200, {
    description: 'Array of Permissions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Permissions, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Permissions) filter?: Filter<Permissions>,
  ): Promise<Permissions[]> {
    return this.permissionsRepository.find(filter);
  }

  @patch('/permissions')
  @response(200, {
    description: 'Permissions PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {partial: true}),
        },
      },
    })
    permissions: Permissions,
    @param.where(Permissions) where?: Where<Permissions>,
  ): Promise<Count> {
    return this.permissionsRepository.updateAll(permissions, where);
  }

  @get('/permissions/{id}')
  @response(200, {
    description: 'Permissions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Permissions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Permissions, {exclude: 'where'}) filter?: FilterExcludingWhere<Permissions>
  ): Promise<Permissions> {
    return this.permissionsRepository.findById(id, filter);
  }

  @patch('/permissions/{id}')
  @response(204, {
    description: 'Permissions PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {partial: true}),
        },
      },
    })
    permissions: Permissions,
  ): Promise<void> {
    await this.permissionsRepository.updateById(id, permissions);
  }

  @put('/permissions/{id}')
  @response(204, {
    description: 'Permissions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() permissions: Permissions,
  ): Promise<void> {
    await this.permissionsRepository.replaceById(id, permissions);
  }

  @del('/permissions/{id}')
  @response(204, {
    description: 'Permissions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.permissionsRepository.deleteById(id);
  }
}
