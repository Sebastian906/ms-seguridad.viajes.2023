import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Permissions, PermissionsRelations, Role, RolePermissions} from '../models';
import {RolePermissionsRepository} from './role-permissions.repository';
import {RoleRepository} from './role.repository';

export class PermissionsRepository extends DefaultCrudRepository<
  Permissions,
  typeof Permissions.prototype._id,
  PermissionsRelations
> {

  public readonly roles: HasManyThroughRepositoryFactory<Role, typeof Role.prototype._id,
          RolePermissions,
          typeof Permissions.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RolePermissionsRepository') protected rolePermissionsRepositoryGetter: Getter<RolePermissionsRepository>, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Permissions, dataSource);
    this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', roleRepositoryGetter, rolePermissionsRepositoryGetter,);
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
  }
}
