import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Permissions,
  RolePermissions,
} from '../models';
import {PermissionsRepository} from '../repositories';

export class PermissionsRolePermissionsController {
  constructor(
    @repository(PermissionsRepository)
    public permissionsRepository: PermissionsRepository,
  ) { }

  @get('/permissions/{id}/role-permissions', {
    responses: {
      '200': {
        description: 'RolePermissions belonging to Permissions',
        content: {
          'application/json': {
            schema: getModelSchemaRef(RolePermissions),
          },
        },
      },
    },
  })
  async getRolePermissions(
    @param.path.string('id') id: typeof Permissions.prototype._id,
  ): Promise<RolePermissions> {
    return this.permissionsRepository.rolePermissions(id);
  }
}
