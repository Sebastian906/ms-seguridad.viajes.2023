import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Role} from './role.model';
import {Permissions} from './permissions.model';

@model()
export class RolePermissions extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  post: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  get: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  put: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  delete: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  download: boolean;

  @belongsTo(() => Role)
  roleId: string;

  @belongsTo(() => Permissions)
  permissionsId: string;
}

export interface RolePermissionsRelations {
  // describe navigational properties here
}

export type RolePermissionsWithRelations = RolePermissions &
  RolePermissionsRelations;
