import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {
  Permissions,
  Role,
  RolePermissions,
  RoleRelations,
  User,
} from '../models';
import {PermissionsRepository} from './permissions.repository';
import {RolePermissionsRepository} from './role-permissions.repository';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype._id,
  RoleRelations
> {
  public readonly permissions: HasManyThroughRepositoryFactory<
    Permissions,
    typeof Permissions.prototype._id,
    RolePermissions,
    typeof Role.prototype._id
  >;

  public readonly users: HasManyRepositoryFactory<
    User,
    typeof Role.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('RolePermissionsRepository')
    protected rolPermissionsRepositoryGetter: Getter<RolePermissionsRepository>,
    @repository.getter('PermissionsRepository')
    protected menuRepositoryGetter: Getter<PermissionsRepository>,
    @repository.getter('UserRepository')
    protected usuarioRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor(
      'users',
      usuarioRepositoryGetter,
    );
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.permissions = this.createHasManyThroughRepositoryFactoryFor(
      'permissions',
      menuRepositoryGetter,
      rolPermissionsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'permissions',
      this.permissions.inclusionResolver,
    );
  }
}
