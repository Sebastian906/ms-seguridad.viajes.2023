export namespace ConfigurationSecurity {
  export const claveJWT = process.env.SECRET_PASSWORD_JWT;
  export const menuUserId = '650e1109b34d36192414e8db';
  export const listarAccion = 'post';
  export const guardarAccion = 'get';
  export const editarAccion = 'put';
  export const eliminarAccion = 'delete';
  export const descargarAccion = 'download';
  export const mongodbConnectionString = process.env.CONNECTION_STRING_MONGODB
}
