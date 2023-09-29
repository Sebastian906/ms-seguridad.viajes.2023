import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConfigurationSecurity} from '../config/seguridad.config';
import {Credentials, FactorAuthenticationCode, User} from '../models';
import {LoginRepository, UserRepository} from '../repositories';
const generator = require('generate-password');
const MD5 = require('crypto-js/md5');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUserService {
  constructor(
    @repository(UserRepository)
    public repositoryUser: UserRepository,
    @repository(LoginRepository)
    public repositoyryLogin: LoginRepository,
  ) {}

  /**
   * Crear una clave aleatoria
   * @returns cadena aleatoria de n caracteres
   */
  crearTextoAleatorio(n: number): string {
    let clave = generator.generate({
      length: n,
      numbers: true,
    });
    return clave;
  }

  /**
   * Cifrar una cadena con método MD5
   * @param cadena texto a cifrar
   * @returns cadena cifrada con MD5
   */
  cifrarTexto(cadena: string): string {
    let cadenaCifrada = MD5(cadena).toString();
    return cadenaCifrada;
  }

  /**
   * Busca a un usuario de acuerdo a sus credenciales
   * @param credentials Credenciales del usuario
   * @returns Encuentra a un usuario o null
   */
  async identifyUser(credentials: Credentials): Promise<User | null> {
    let user = await this.repositoryUser.findOne({
      where: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    return user as User;
  }

  /**
   * Valida un codigo de 2fa de un usuario
   * @param credential2fa credenciales del usuario con el codigo del 2fa
   * @returns el registro de login o null
   */
  async validateCode2fa(
    credential2fa: FactorAuthenticationCode,
  ): Promise<User | null> {
    let login = await this.repositoyryLogin.findOne({
      where: {
        userId: credential2fa.UserId,
        code2fa: credential2fa.code2fa,
        codeState: false,
      },
    });
    if (login) {
      let user = await this.repositoryUser.findById(credential2fa.UserId);
      return user;
    }
    return null;
  }

  /**
   * Generacion de JWT
   * @param user informacion del usuario
   * @returns token
   */
  createToken(user: User) {
    let datos = {
      name: `${user.name} ${user.secondName} ${user.lastName} ${user.secondLastname}`,
      role: user.roleId,
      email: user.email,
    };
    let token = jwt.sign(datos, ConfigurationSecurity.claveJWT);
    return token;
  }

  /**
   * valida y obtiene el rol desde un token
   * @param token el token
   * @returns el _id del rol
   */
  getRoleFromToken(token: string) {
    let data = jwt.verify(token, ConfigurationSecurity.claveJWT);
    return data.role;
  }
}
