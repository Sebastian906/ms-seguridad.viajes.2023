import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {RolePermissionsRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(RolePermissionsRepository)
    private repositoryRolePermissions: RolePermissionsRepository,
  ) { }

  async VerifyUserPermissionByRole(idRole: string, idPermissions: string, accion: string): Promise<UserProfile | undefined> {
    let existsPermission = await this.repositoryRolePermissions.findOne({
      where: {
        roleId: idRole,
        permissionsId: idPermissions,
      },
    });
    console.log(existsPermission);
    let continuar: boolean = false;
    if (existsPermission) {
      switch (accion) {
        case "get":
          continuar = existsPermission.get;
          break;
        case "put":
          continuar = existsPermission.put;
          break;
        case 'post':
          continuar = existsPermission.post;
          break;
        case "delete":
          continuar = existsPermission.delete;
          break;
        case "download":
          continuar = existsPermission.download;
          break;
        default:
          throw new HttpErrors.Unauthorized('No es posible ejecutar la acción porque no existe.');
        }
      if (continuar) {
        let perfil: UserProfile = Object.assign({
          permitido: "OK"
        });
        return perfil;
      } else {
        return undefined;
      }
    } else {
    throw new HttpErrors[401]('No es posible ejecutar la accion por falta de permisos.');
    }
  }

}
