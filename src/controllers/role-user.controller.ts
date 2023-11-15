import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Role,
  User,
} from '../models';
import {RoleRepository} from '../repositories';

export class RoleUserController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  @get('/roles/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Role',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Role.prototype._id,
  ): Promise<User> {
    return this.roleRepository.user(id);
  }
}
