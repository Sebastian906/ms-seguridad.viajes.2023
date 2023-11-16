import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {
  Permissions,
  PermissionsRelations,
  Role,
  RolePermissions,
} from '../models';
import {RolePermissionsRepository} from './role-permissions.repository';
import {RoleRepository} from './role.repository';

export class PermissionsRepository extends DefaultCrudRepository<
  Permissions,
  typeof Permissions.prototype._id,
  PermissionsRelations
> {
  public readonly roles: HasManyThroughRepositoryFactory<
    Role,
    typeof Role.prototype._id,
    RolePermissions,
    typeof Permissions.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('RolePermissionsRepository')
    protected rolPermissionsRepositoryGetter: Getter<RolePermissionsRepository>,
    @repository.getter('RoleRepository')
    protected rolRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Permissions, dataSource);
    this.roles = this.createHasManyThroughRepositoryFactoryFor(
      'roles',
      rolRepositoryGetter,
      rolPermissionsRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
  }
}
