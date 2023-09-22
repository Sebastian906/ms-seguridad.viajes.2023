import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<RolePermissions>) {
    super(data);
  }
}

export interface RolePermissionsRelations {
  // describe navigational properties here
}

export type RolePermissionsWithRelations = RolePermissions & RolePermissionsRelations;
