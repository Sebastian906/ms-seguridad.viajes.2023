import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {RolePermissions, RolePermissionsRelations, Role} from '../models';
import {RoleRepository} from './role.repository';

export class RolePermissionsRepository extends DefaultCrudRepository<
  RolePermissions,
  typeof RolePermissions.prototype._id,
  RolePermissionsRelations
> {

  public readonly role: BelongsToAccessor<Role, typeof RolePermissions.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(RolePermissions, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
