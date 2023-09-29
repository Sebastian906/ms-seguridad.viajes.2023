import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {RolePermissionsRepository} from '../repositories';
import {SeguridadUserService} from '../services';

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @service(SeguridadUserService)
    private serviceSeguridad: SeguridadUserService,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(RolePermissionsRepository)
    private repositoryRolePermissions: RolePermissionsRepository,
  ) {}

  /**
   * autenticacion de un usuario frente a una accion en la base de datos
   * @param request la solicitud con el token
   * @returns el perfil del usuario, undefined cuando no tiene permiso o httpError[401] cuando no tiene token
   */

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
      let idRole = this.serviceSeguridad.getRoleFromToken(token);
      let idMenu: string = this.metadata.options![0];
      // NO esta implementado las acciones del usuario
      //let accion: string = this.metadata.options![1];
      let existsPermission = await this.repositoryRolePermissions.findOne({
        where: {
          roleId: idRole,
          menuId: idMenu,
        },
      });
      if (existsPermission) {
        // no implementado
        //switch ("accion") {
      } else {
        throw new HttpErrors[401](
          'No tiene permisos para realizar esta acción',
        );
      }
    }
    throw new HttpErrors[401](
      'No es posible ejecutar la accion por falta de un token',
    );
  }
}
