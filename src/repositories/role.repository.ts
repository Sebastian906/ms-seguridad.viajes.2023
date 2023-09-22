import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Role, RoleRelations, Permissions, RolePermissions, User} from '../models';
import {RolePermissionsRepository} from './role-permissions.repository';
import {PermissionsRepository} from './permissions.repository';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype._id,
  RoleRelations
> {

  public readonly permissions: HasManyThroughRepositoryFactory<Permissions, typeof Permissions.prototype._id,
          RolePermissions,
          typeof Role.prototype._id
        >;

  public readonly users: HasManyRepositoryFactory<User, typeof Role.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RolePermissionsRepository') protected rolePermissionsRepositoryGetter: Getter<RolePermissionsRepository>, @repository.getter('PermissionsRepository') protected permissionsRepositoryGetter: Getter<PermissionsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', permissionsRepositoryGetter, rolePermissionsRepositoryGetter,);
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
  }
}
