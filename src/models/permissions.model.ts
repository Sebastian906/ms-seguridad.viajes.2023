import {Entity, hasMany, model, property} from '@loopback/repository';
import {RolePermissions} from './role-permissions.model';
import {Role} from './role.model';

@model()
export class Permissions extends Entity {
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
  comentary?: string;

  @hasMany(() => Role, {through: {model: () => RolePermissions}})
  roles: Role[];

  constructor(data?: Partial<Permissions>) {
    super(data);
  }
}

export interface PermissionsRelations {
  // describe navigational properties here
}

export type PermissionsWithRelations = Permissions & PermissionsRelations;
