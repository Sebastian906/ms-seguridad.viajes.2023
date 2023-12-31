import {Entity, belongsTo, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Login extends Entity {
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
  code2fa: string;

  @property({
    type: 'boolean',
    required: true,
  })
  codeState: boolean;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'boolean',
    required: true,
  })
  tokenState: boolean;

  @belongsTo(() => User)
  userId: string;
  constructor(data?: Partial<Login>) {
    super(data);
  }
}

export interface LoginRelations {
  // describe navigational properties here
}

export type LoginWithRelations = Login & LoginRelations;
