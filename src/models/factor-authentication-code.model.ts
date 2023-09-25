import {Model, model, property} from '@loopback/repository';

@model()
export class FactorAuthenticationCode extends Model {
  @property({
    type: 'string',
    required: true,
  })
  UserId: string;

  @property({
    type: 'string',
    required: true,
  })
  code2fa: string;


  constructor(data?: Partial<FactorAuthenticationCode>) {
    super(data);
  }
}

export interface FactorAuthenticationCodeRelations {
  // describe navigational properties here
}

export type FactorAuthenticationCodeWithRelations = FactorAuthenticationCode & FactorAuthenticationCodeRelations;
