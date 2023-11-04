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
  Role,
} from '../models';
import {RolePermissionsRepository} from '../repositories';

export class RolePermissionsRoleController {
  constructor(
    @repository(RolePermissionsRepository)
    public rolePermissionsRepository: RolePermissionsRepository,
  ) { }

  @get('/role-permissions/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to RolePermissions',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role),
          },
        },
      },
    },
  })
  async getRole(
    @param.path.string('id') id: typeof RolePermissions.prototype._id,
  ): Promise<Role> {
    return this.rolePermissionsRepository.role(id);
  }
}
