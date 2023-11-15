import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {RolePermissions, RolePermissionsRelations, Role, Permissions} from '../models';
import {RoleRepository} from './role.repository';
import {PermissionsRepository} from './permissions.repository';

export class RolePermissionsRepository extends DefaultCrudRepository<
  RolePermissions,
  typeof RolePermissions.prototype._id,
  RolePermissionsRelations
> {

  public readonly role: BelongsToAccessor<Role, typeof RolePermissions.prototype._id>;

  public readonly permissions: HasOneRepositoryFactory<Permissions, typeof RolePermissions.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('PermissionsRepository') protected permissionsRepositoryGetter: Getter<PermissionsRepository>,
  ) {
    super(RolePermissions, dataSource);
    this.permissions = this.createHasOneRepositoryFactoryFor('permissions', permissionsRepositoryGetter);
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
