import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {RolePermissions, RolePermissionsRelations} from '../models';

export class RolePermissionsRepository extends DefaultCrudRepository<
  RolePermissions,
  typeof RolePermissions.prototype._id,
  RolePermissionsRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(RolePermissions, dataSource);
  }
}
