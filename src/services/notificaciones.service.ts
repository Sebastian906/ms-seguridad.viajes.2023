import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Agent} from 'https';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) {}

  EnviarNotificacion(datos: any, url: string) {
    fetch(url, {
      method: 'post',
      body: JSON.stringify(datos),
      headers: {'Content-Type': 'application/json'},
      agent: new Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}
