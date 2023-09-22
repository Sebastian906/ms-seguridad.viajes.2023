import {Entity, model, property, hasMany} from '@loopback/repository';
import {Permissions} from './permissions.model';
import {RolePermissions} from './role-permissions.model';
import {User} from './user.model';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @hasMany(() => Permissions, {through: {model: () => RolePermissions}})
  permissions: Permissions[];

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
