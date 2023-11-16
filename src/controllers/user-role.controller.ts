import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Role, User} from '../models';
import {UserRepository} from '../repositories';

export class UserRoleController {
  constructor(
    @repository(UserRepository)
    public usuarioRepository: UserRepository,
  ) {}

  @get('/users/{id}/rol', {
    responses: {
      '200': {
        description: 'Role belonging to User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role),
          },
        },
      },
    },
  })
  async getRole(
    @param.path.string('id') id: typeof User.prototype._id,
  ): Promise<Role> {
    return this.usuarioRepository.rol(id);
  }
}
