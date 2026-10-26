/** Extrae el mensaje de error devuelto por el backend ({ mensaje: "..." }). */
export function mensajeError(err: any): string {
  if (err?.status === 0) return 'No hay conexión con el servidor.';
  return err?.error?.mensaje ?? 'Ocurrió un error inesperado.';
}
