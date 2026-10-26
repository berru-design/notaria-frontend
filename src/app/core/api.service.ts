import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  Consulta, EstadoSolicitud, HistorialSolicitud, RegistroRequest, RequisitoServicio,
  RespuestaConsulta, Rol, ServicioNotarial, Solicitud, Usuario
} from './models';

/** Capa de acceso al backend Spring Boot. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // ---- Servicios notariales ----
  servicios() { return this.http.get<ServicioNotarial[]>(`${this.api}/servicios`); }
  requisitos(idServicio: number) { return this.http.get<RequisitoServicio[]>(`${this.api}/servicios/${idServicio}/requisitos`); }
  crearServicio(s: ServicioNotarial) { return this.http.post<ServicioNotarial>(`${this.api}/servicios`, s); }
  actualizarServicio(id: number, s: ServicioNotarial) { return this.http.put<ServicioNotarial>(`${this.api}/servicios/${id}`, s); }
  desactivarServicio(id: number) { return this.http.delete<void>(`${this.api}/servicios/${id}`); }
  agregarRequisito(idServicio: number, r: RequisitoServicio) { return this.http.post<RequisitoServicio>(`${this.api}/servicios/${idServicio}/requisitos`, r); }
  desactivarRequisito(idRequisito: number) { return this.http.delete<void>(`${this.api}/servicios/requisitos/${idRequisito}`); }

  // ---- Solicitudes ----
  registrarSolicitud(body: { idServicio: number; detalle: string }) { return this.http.post<Solicitud>(`${this.api}/solicitudes`, body); }
  solicitudes() { return this.http.get<Solicitud[]>(`${this.api}/solicitudes`); }
  solicitud(id: number) { return this.http.get<Solicitud>(`${this.api}/solicitudes/${id}`); }
  historial(id: number) { return this.http.get<HistorialSolicitud[]>(`${this.api}/solicitudes/${id}/historial`); }
  estadosSolicitud() { return this.http.get<EstadoSolicitud[]>(`${this.api}/solicitudes/estados`); }
  cambiarEstado(id: number, body: { idEstado: number; observacion: string }) { return this.http.patch<Solicitud>(`${this.api}/solicitudes/${id}/estado`, body); }

  // ---- Consultas ----
  consultas() { return this.http.get<Consulta[]>(`${this.api}/consultas`); }
  registrarConsulta(body: { asunto: string; descripcion: string }) { return this.http.post<Consulta>(`${this.api}/consultas`, body); }
  respuestas(idConsulta: number) { return this.http.get<RespuestaConsulta[]>(`${this.api}/consultas/${idConsulta}/respuestas`); }
  responder(idConsulta: number, respuesta: string) { return this.http.post<RespuestaConsulta>(`${this.api}/consultas/${idConsulta}/respuestas`, { respuesta }); }

  // ---- Usuarios (administrador) ----
  usuarios() { return this.http.get<Usuario[]>(`${this.api}/usuarios`); }
  roles() { return this.http.get<Rol[]>(`${this.api}/usuarios/roles`); }
  crearUsuario(u: RegistroRequest) { return this.http.post<Usuario>(`${this.api}/usuarios`, u); }
  estadoUsuario(id: number, activo: boolean) { return this.http.patch<Usuario>(`${this.api}/usuarios/${id}/estado?activo=${activo}`, {}); }
}
