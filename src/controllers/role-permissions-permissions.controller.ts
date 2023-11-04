import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RolePermissions,
  Permissions,
} from '../models';
import {RolePermissionsRepository} from '../repositories';

export class RolePermissionsPermissionsController {
  constructor(
    @repository(RolePermissionsRepository)
    public rolePermissionsRepository: RolePermissionsRepository,
  ) { }

  @get('/role-permissions/{id}/permissions', {
    responses: {
      '200': {
        description: 'Permissions belonging to RolePermissions',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permissions),
          },
        },
      },
    },
  })
  async getPermissions(
    @param.path.string('id') id: typeof RolePermissions.prototype._id,
  ): Promise<Permissions> {
    return this.rolePermissionsRepository.permissions(id);
  }
}
