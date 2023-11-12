import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {PermissionsRoleMenuRelations, RolePermissions} from '../models';

export class PermissionsRoleMenuRepository extends DefaultCrudRepository<
  RolePermissions,
  typeof RolePermissions.prototype._id,
  PermissionsRoleMenuRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(RolePermissions, dataSource);
  }
}
