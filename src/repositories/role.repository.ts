import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Role, RoleRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype._id,
  RoleRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Role.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
