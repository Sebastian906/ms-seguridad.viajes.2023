import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  Login,
} from '../models';
import {UserRepository} from '../repositories';

export class UserLoginController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/login', {
    responses: {
      '200': {
        description: 'Login belonging to User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Login),
          },
        },
      },
    },
  })
  async getLogin(
    @param.path.string('id') id: typeof User.prototype._id,
  ): Promise<Login> {
    return this.userRepository.login(id);
  }
}
