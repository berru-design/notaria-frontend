import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { EstadoSolicitud, HistorialSolicitud, Solicitud } from '../../core/models';
import { mensajeError } from '../../core/util';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';

@Component({
  selector: 'app-solicitud-detalle',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, EstadoBadgeComponent],
  template: `
    <a routerLink="/solicitudes" class="btn btn-link ps-0">&larr; Volver</a>
    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (ok) { <div class="alert alert-success">{{ ok }}</div> }
    @if (solicitud) {
      <div class="row g-3">
        <div class="col-lg-7">
          <div class="card shadow-sm"><div class="card-body">
            <div class="d-flex justify-content-between">
              <h2 class="h5">Solicitud N° {{ solicitud.idSolicitud }}</h2>
              <app-estado-badge [nombre]="solicitud.estado.nombre" />
            </div>
            <dl class="row mb-0 mt-3">
              <dt class="col-sm-4">Servicio</dt><dd class="col-sm-8">{{ solicitud.servicio.nombre }}</dd>
              <dt class="col-sm-4">Cliente</dt><dd class="col-sm-8">{{ solicitud.usuario.nombres }} {{ solicitud.usuario.apellidos }} (DNI {{ solicitud.usuario.dni }})</dd>
              <dt class="col-sm-4">Fecha de registro</dt><dd class="col-sm-8">{{ solicitud.fechaRegistro | date: 'dd/MM/yyyy HH:mm' }}</dd>
              <dt class="col-sm-4">Detalle</dt><dd class="col-sm-8">{{ solicitud.detalle || '—' }}</dd>
            </dl>
          </div></div>

          @if (auth.esStaff()) {
            <div class="card shadow-sm mt-3"><div class="card-body">
              <h3 class="h6">Actualizar estado</h3>
              @if (cerrada) {
                <p class="text-muted mb-0">La solicitud está cerrada y ya no admite cambios.</p>
              } @else {
                <div class="mb-2">
                  <select class="form-select" [(ngModel)]="nuevoEstado">
                    <option [ngValue]="null" disabled>Seleccione el nuevo estado...</option>
                    @for (e of estados; track e.idEstado) {
                      @if (e.idEstado !== solicitud.estado.idEstado) { <option [ngValue]="e.idEstado">{{ e.nombre.replace('_', ' ') }}</option> }
                    }
                  </select>
                </div>
                <div class="mb-2">
                  <textarea class="form-control" rows="2" maxlength="500" [(ngModel)]="observacion" placeholder="Observación (opcional)"></textarea>
                </div>
                <button class="btn btn-primary btn-sm" [disabled]="!nuevoEstado" (click)="cambiar()">Guardar cambio</button>
              }
            </div></div>
          }
        </div>

        <div class="col-lg-5">
          <div class="card shadow-sm"><div class="card-body">
            <h3 class="h6 mb-3">Historial de la solicitud</h3>
            <div class="timeline">
              @for (h of historial; track h.idHistorial) {
                <div class="timeline-item">
                  <app-estado-badge [nombre]="h.estado.nombre" />
                  <div class="small text-muted">{{ h.fechaHora | date: 'dd/MM/yyyy HH:mm' }} · {{ h.usuario.nombres }} {{ h.usuario.apellidos }}</div>
                  @if (h.observacion) { <div class="small">{{ h.observacion }}</div> }
                </div>
              }
            </div>
          </div></div>
        </div>
      </div>
    }
  `
})
export class SolicitudDetalleComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);
  id = Number(this.route.snapshot.paramMap.get('id'));
  solicitud?: Solicitud;
  historial: HistorialSolicitud[] = [];
  estados: EstadoSolicitud[] = [];
  nuevoEstado: number | null = null;
  observacion = ''; error = ''; ok = '';

  get cerrada() {
    return ['FINALIZADA', 'RECHAZADA'].includes(this.solicitud?.estado.nombre ?? '');
  }

  ngOnInit() {
    this.cargar();
    if (this.auth.esStaff()) this.api.estadosSolicitud().subscribe((e) => (this.estados = e));
  }

  cargar() {
    this.api.solicitud(this.id).subscribe({
      next: (s) => (this.solicitud = s),
      error: (e) => (this.error = mensajeError(e))
    });
    this.api.historial(this.id).subscribe((h) => (this.historial = h));
  }

  cambiar() {
    if (!this.nuevoEstado) return;
    this.error = ''; this.ok = '';
    this.api.cambiarEstado(this.id, { idEstado: this.nuevoEstado, observacion: this.observacion }).subscribe({
      next: () => { this.ok = 'Estado actualizado correctamente.'; this.nuevoEstado = null; this.observacion = ''; this.cargar(); },
      error: (e) => (this.error = mensajeError(e))
    });
  }
}
