import {authenticate} from '@loopback/authentication';
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
import {UserProfile} from '@loopback/security';
import {ConfigurationNotifications} from '../config/notificaciones.config';
import {ConfigurationSecurity} from '../config/seguridad.config';
import {
  CredencialesRecuperarClave,
  Credentials,
  FactorAuthenticationCode,
  HashValidacionUsuario,
  Login,
  PermissionsRoleMenu,
  User,
} from '../models';
import {LoginRepository, UserRepository} from '../repositories';
import {
  AuthService,
  NotificacionesService,
  SeguridadUserService,
} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(SeguridadUserService)
    public servicioSeguridad: SeguridadUserService,
    @repository(LoginRepository)
    public repositoryLogin: LoginRepository,
    @service(AuthService)
    private serviceAuth: AuthService,
    @service(NotificacionesService)
    public serviceNotifications: NotificacionesService,
  ) {}

  @authenticate({
    strategy : 'auth',
    options : ["Usuario", "guardar"]
  })
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


  @post('/usuario-publico')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async creacionPublica(
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
    // hash de validacion de correo
    let hash = this.servicioSeguridad.crearTextoAleatorio(100);
    user.hashValidacion = hash;
    user.estadoValidacion = false;
    user.aceptado = false;


    //notificacion de hash en correo
    let enlace =`<a href="${ConfigurationNotifications.urlvalidacionFronted}/${hash}" target='_blank'> Validar usuario </a>`;
    let datos = {
      correoDestino: user.email,
      nombreDestino: user.name + ' ' + user.secondName,
      contenidoCorreo:  `Por favor, valide su correo electrónico haciendo click en el siguiente enlace: ${enlace}`,
      asuntoDestino: ConfigurationNotifications.asuntoVerificacionCorreo,
    };
    let url = ConfigurationNotifications.urlCorreoRecuperacionClave;
    this.serviceNotifications.EnviarNotificacion(datos, url);


    //notificacion de hash en correo
    let datosCorreo = {
      correoDestino: user.email,
      nombreDestino: user.name + ' ' + user.secondName,
      contenidoCorreo:  `Su clave asiganda es: ${clave}`,
      asuntoDestino: ConfigurationNotifications.asuntoClaveAsignada,
    };

    this.serviceNotifications.EnviarNotificacion(datosCorreo, url);

    // enviar correo electrónico de notificación
    return this.userRepository.create(user);
  }

  @post('/validar-hash-usuario')
  @response(200, {
    description: 'Validar hash'
  })
  async ValidarHashUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HashValidacionUsuario, {}),
        },
      },
    })
    hash: HashValidacionUsuario,
  ): Promise<Boolean> {
    let usuario = await this.userRepository.findOne({
      where: {
        hashValidacion: hash.codigoHash,
        estadoValidacion: false,
      },
    });
    if (usuario) {
      usuario.estadoValidacion = true;
      this.userRepository.updateById(usuario._id, usuario);
      return true;
    }
    return false;
  }

  @get('/user/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [
      ConfigurationSecurity.menuUserId,
      ConfigurationSecurity.listarAccion,
    ],
  })
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
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
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
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
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

  @post('/recuperar-clave')
  @response(200, {
    description: 'Sends user password with the email provided',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async RecuperarClaveUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CredencialesRecuperarClave),
        },
      },
    })
    credentials: CredencialesRecuperarClave,
  ): Promise<object> {
    let user = await this.userRepository.findOne({
      where: {
        email: credentials.correo,
      },
    });
    if (user) {
      let nuevaClave = this.servicioSeguridad.crearTextoAleatorio(5);
      console.log(nuevaClave);
      let claveCifrada = this.servicioSeguridad.cifrarTexto(nuevaClave);
      user.password = claveCifrada;
      this.userRepository.updateById(user._id, user);

      // notificar al usuario via correo o sms

      let datos = {
        correoDestino: user.email,
        nombreDestino: user.name + ' ' + user.secondName,
        contenidoCorreo:  `Su nueva clave es: ${nuevaClave}`,
        asuntoDestino: ConfigurationNotifications.asuntoRecuperacionClave,
      };
      let url = ConfigurationNotifications.urlCorreoRecuperacionClave;
      this.serviceNotifications.EnviarNotificacion(datos, url);
      return user;
    }
    return new HttpErrors[401]('Credenciales incorrectas.');
  }

  @post('/identify-user')
  @response(200, {
    description: 'Identifies user by email and password',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async indetifyUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials),
        },
      },
    })
    credentials: Credentials,
  ): Promise<object> {
    let user = await this.servicioSeguridad.identifyUser(credentials);
    if (user) {
      let code2fa = this.servicioSeguridad.crearTextoAleatorio(5);
      console.log(code2fa);

      let login: Login = new Login();
      login.userId = user._id!;
      login.code2fa = code2fa;
      login.codeState = false;
      login.token = '';
      login.tokenState = false;
      this.repositoryLogin.create(login);
      user.password = '';
      // notificar al usuario via correo o sms
      let datos = {
        correoDestino: user.email,
        nombreDestino: user.name + ' ' + user.secondName,
        contenidoCorreo: `Su código de segundo factor de autenticación es: ${code2fa}`,
        asuntoDestino: ConfigurationNotifications.asunto2fa,
      };
      let url = ConfigurationNotifications.urlNotificaciones2fa;
      console.log(url);
      this.serviceNotifications.EnviarNotificacion(datos, url);
      return user;
    }
    return new HttpErrors[401]('Credenciales incorrectas.');
  }

  @post('/validate-permissions')
  @response(200, {
    description: 'Validates permissions of user for business logic',
    content: {
      'application/json': {schema: getModelSchemaRef(PermissionsRoleMenu)},
    },
  })
  async ValidatePermissionsUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PermissionsRoleMenu),
        },
      },
    })
    datos: PermissionsRoleMenu,
  ): Promise<UserProfile | undefined> {
    let idRole = this.servicioSeguridad.getRoleFromToken(datos.token);
    return this.serviceAuth.VerifyUserPermissionByRole(
      idRole,
      datos.idPermissions,
      datos.accion,
    );
  }

  @post('/Verify-2fa')
  @response(200, {
    description: 'Identifies user by email and password',
  })
  async VerifyCode2fa(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FactorAuthenticationCode),
        },
      },
    })
    credentials: FactorAuthenticationCode,
  ): Promise<object> {
    let user = await this.servicioSeguridad.validateCode2fa(credentials);
    if (user) {
      let token = this.servicioSeguridad.createToken(user);
      if (user) {
        user.password = '';
        try {
          this.userRepository.logins(user._id).patch(
            {
              codeState: true,
              token: token,
            },
            {
              codeState: false,
            },
          );
        } catch {
          console.log(
            'No se ha almacenado el cambio del estado de token en la base de datos.',
          );
        }
        return {
          user: user,
          token: token,
        };
      }
    }
    return new HttpErrors[401](
      'Codigo de 2fa invalido para el usuario definido.',
    );
  }
}
