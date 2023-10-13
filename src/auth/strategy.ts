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
import {AuthService, SeguridadUserService} from '../services';

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @service(SeguridadUserService)
    private serviceSeguridad: SeguridadUserService,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
    @repository(RolePermissionsRepository)
    private repositoryRolePermissions: RolePermissionsRepository,
    @service(AuthService)
    private serviceAuth: AuthService
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
      let idPermissions: string = this.metadata[0].options![0];
      let accion: string = this.metadata[0].options![1];
      console.log(this.metadata);
      try {
        let res = await this.serviceAuth.VerifyUserPermissionByRole(idRole, idPermissions, accion);
        return res;
      } catch(e) {
        throw e;
      }
    }
    throw new HttpErrors[401]('No es posible ejecutar la acción por falta de un token.')
  }
}
