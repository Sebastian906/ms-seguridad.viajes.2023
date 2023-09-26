import {service} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Credentials, FactorAuthenticationCode, Login, User} from '../models';
import {LoginRepository, UserRepository} from '../repositories';
import {SeguridadUserService} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @service(SeguridadUserService)
    public servicioSeguridad: SeguridadUserService,
    @repository(LoginRepository)
    public repositoryLogin: LoginRepository
  ) {}

  @post('/user')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User> {
    // crear la clave
    let clave = this.servicioSeguridad.crearTextoAleatorio(10);
    console.log(clave);
    // cifrar la clave
    let claveCifrada = this.servicioSeguridad.cifrarTexto(clave);
    // asignar la clave cifrada al usuario
    user.password = claveCifrada;
    // enviar correo electrónico de notificación
    return this.userRepository.create(user);
  }

  @get('/user/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/user')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/user')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/user/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/user/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/user/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  /**
   * Métodos personalizados para la API
   */

  @post('/identify-user')
  @response(200, {
    description: "Identifies user by email and password",
    content: {'application/json': {schema: getModelSchemaRef(User)}}
  })
  async indetifyUser(
    @requestBody(
      {
        content: {
          'application/json': {
            schema: getModelSchemaRef(Credentials)
          }
        }
      }
    )
    credentials: Credentials
  ): Promise<object> {
    let user = await this.servicioSeguridad.identifyUser(credentials);
    if (user) {
      let code2fa = this.servicioSeguridad.crearTextoAleatorio(5);
      console.log(code2fa);
      let login:Login = new Login();
      login.userId = user._id!;
      login.code2fa = code2fa;
      login.codeState = false;
      login.token = '';
      login.tokenState = false;
      this.repositoryLogin.create(login);
      user.password = "";
      // notificar al usuario via correo o sms
      return user;
    }
    return new HttpErrors[401]("Credenciales incorrectas.");
  }

  @post('/Verify-2fa')
  @response(200, {
    description: "Identifies user by email and password",
  })
  async VerifyCode2fa(
    @requestBody(
      {
        content: {
          'application/json': {
            schema: getModelSchemaRef(FactorAuthenticationCode)
          }
        }
      }
    )
    credentials: FactorAuthenticationCode
  ): Promise<object> {
    let user = await this.servicioSeguridad.validateCode2fa(credentials);
    if (user){
      let token = this.servicioSeguridad.createToken(user);
    if(user){
      user.password = "";
      try{
        this.userRepository.logins(user._id).patch(
        {
          codeState: true,
          token: token,
        },{
          codeState: false
        });
    }catch{
      console.log("No se ha almacenado el cambio del estado de token en la base de datos.");
      
    }
      return {
        user: user,
        token:token
      };
    }
    }
    return new HttpErrors[401]("Codigo de 2fa invalido para el usuario definido.");
  }
}
