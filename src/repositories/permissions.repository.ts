import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Permissions, PermissionsRelations, RolePermissions} from '../models';
import {RolePermissionsRepository} from './role-permissions.repository';

export class PermissionsRepository extends DefaultCrudRepository<
  Permissions,
  typeof Permissions.prototype._id,
  PermissionsRelations
> {

  public readonly rolePermissions: BelongsToAccessor<RolePermissions, typeof Permissions.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RolePermissionsRepository') protected rolePermissionsRepositoryGetter: Getter<RolePermissionsRepository>,
  ) {
    super(Permissions, dataSource);
    this.rolePermissions = this.createBelongsToAccessorFor('rolePermissions', rolePermissionsRepositoryGetter,);
    this.registerInclusionResolver('rolePermissions', this.rolePermissions.inclusionResolver);
  }
}
