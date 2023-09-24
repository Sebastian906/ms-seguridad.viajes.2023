import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Credentials, User} from '../models';
import {UserRepository} from '../repositories';
const generator = require('generate-password');
const MD5 = require("crypto-js/md5");

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUserService {
  constructor(
    @repository(UserRepository)
    public repositoryUser: UserRepository
  ) { }

  /**
   * Crear una clave aleatoria
   * @returns cadena aleatoria de n caracteres
   */
  crearTextoAleatorio(n:number): string {
    let clave = generator.generate({
      length: n,
      numbers: true
    });
    return clave;
  }

  /**
   * Cifrar una cadena con método MD5
   * @param cadena texto a cifrar
   * @returns cadena cifrada con MD5
   */
  cifrarTexto(cadena: string): string{
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
      where:{
        email: credentials.email,
        password: credentials.password
      }
    });
    return user as User;
  }
}
