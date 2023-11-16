import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Login, User} from '../models';
import {LoginRepository} from '../repositories';

export class LoginUsuarioController {
  constructor(
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
  ) {}

  @get('/logins/{id}/usuario', {
    responses: {
      '200': {
        description: 'User belonging to Login',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Login.prototype._id,
  ): Promise<User> {
    return this.loginRepository.user(id);
  }
}
