import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Permissions>) {
    super(data);
  }
}

export interface PermissionsRelations {
  // describe navigational properties here
}

export type PermissionsWithRelations = Permissions & PermissionsRelations;
