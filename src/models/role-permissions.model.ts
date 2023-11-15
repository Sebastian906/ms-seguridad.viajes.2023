import {Model, model, property, belongsTo} from '@loopback/repository';
import {Role} from './role.model';

@model({settings: {strict: false}})
export class RolePermissions extends Model {
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
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RolePermissions>) {
    super(data);
  }
}

export interface RolePermissionsRelations {
  // describe navigational properties here
}

export type RolePermissionsWithRelations = RolePermissions & RolePermissionsRelations;
