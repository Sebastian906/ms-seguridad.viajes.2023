import {Entity, hasOne, model, property} from '@loopback/repository';
import {RolePermissions} from './role-permissions.model';

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
  comentary: string;

  @hasOne(() => RolePermissions)
  role: RolePermissions;

  constructor(data?: Partial<Permissions>) {
    super(data);
  }
}

export interface PermissionsRelations {
  // describe navigational properties here
}

export type PermissionsWithRelations = Permissions & PermissionsRelations;
