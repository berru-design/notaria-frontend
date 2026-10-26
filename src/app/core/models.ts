export interface Rol { idRol: number; nombre: string; descripcion?: string; estado?: boolean; }

export interface Usuario {
  idUsuario: number; nombres: string; apellidos: string; dni: string;
  correo: string; estado: boolean; rol: Rol;
}

export interface AuthResponse {
  token: string; idUsuario: number; nombres: string; apellidos: string; correo: string; rol: string;
}

export interface RegistroRequest {
  nombres: string; apellidos: string; dni: string; correo: string; clave: string; idRol?: number | null;
}

export interface ServicioNotarial {
  idServicio?: number; nombre: string; descripcion?: string; requisitos?: string; estado?: boolean;
}

export interface RequisitoServicio {
  idRequisito?: number; descripcion: string; obligatorio: boolean; estado?: boolean;
}

export interface EstadoSolicitud { idEstado: number; nombre: string; descripcion?: string; }

export interface Solicitud {
  idSolicitud: number; fechaRegistro: string; detalle?: string;
  usuario: Usuario; servicio: ServicioNotarial; estado: EstadoSolicitud;
}

export interface HistorialSolicitud {
  idHistorial: number; fechaHora: string; observacion?: string;
  estado: EstadoSolicitud; usuario: Usuario;
}

export interface Consulta {
  idConsulta: number; asunto: string; descripcion: string; fechaRegistro: string;
  estado: string; usuario: Usuario;
}

export interface RespuestaConsulta {
  idRespuesta: number; respuesta: string; fechaRespuesta: string; usuario: Usuario;
}
