import {Model, model, property} from '@loopback/repository';

@model()
export class PermissionsRoleMenu extends Model {
  @property({
    type: 'string',
    required: true,
  })
  idRole: string;

  @property({
    type: 'string',
    required: true,
  })
  idPermissions: string;

  @property({
    type: 'string',
    required: true,
  })
  accion: string;


  constructor(data?: Partial<PermissionsRoleMenu>) {
    super(data);
  }
}

export interface PermissionsRoleMenuRelations {
  // describe navigational properties here
}

export type PermissionsRoleMenuWithRelations = PermissionsRoleMenu & PermissionsRoleMenuRelations;
