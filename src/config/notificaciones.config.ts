export namespace ConfigurationNotifications {
  export const asunto2fa: string = 'Código de verificación';
  export const asuntoRecuperacionClave: string = 'Recuperación de clave';
  export const asuntoVerificacionCorreo: string = 'Verificacion de correo';
  export const asuntoClaveAsignada: string =
    'Asignación de clave de acceso';
  export const urlNotificaciones2fa: string =
    'https://localhost:7003/Notificaciones/enviar-correo-2fa';
  export const urlNotificacionesSMS: string =
    'https://localhost:7003/Notificaciones/enviar-sms';
  export const urlCorreoRecuperacionClave: string =
    'https://localhost:7003/Notificaciones/correo-recuperacion-clave';
  export const urlvalidacionFronted : string =
  'http://localhost:4200/seguridad/validar-hash-usuario-publico';
}
