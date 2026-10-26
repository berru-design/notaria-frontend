import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Solicitud } from '../../core/models';
import { mensajeError } from '../../core/util';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, EstadoBadgeComponent],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <h2 class="h4 mb-0">{{ auth.esStaff() ? 'Bandeja de solicitudes' : 'Mis solicitudes' }}</h2>
      <div class="d-flex gap-2">
        @if (auth.esStaff()) {
          <select class="form-select form-select-sm" [(ngModel)]="filtro">
            <option value="">Todos los estados</option>
            @for (e of estadosDisponibles; track e) { <option [value]="e">{{ e.replace('_', ' ') }}</option> }
          </select>
        }
        @if (auth.esCliente()) { <a class="btn btn-primary btn-sm" routerLink="/solicitudes/nueva">Nueva solicitud</a> }
      </div>
    </div>
    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    <div class="card shadow-sm"><div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr><th>N°</th><th>Fecha</th><th>Servicio</th>@if (auth.esStaff()) { <th>Cliente</th> }<th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (s of filtradas; track s.idSolicitud) {
            <tr>
              <td>{{ s.idSolicitud }}</td>
              <td>{{ s.fechaRegistro | date: 'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ s.servicio.nombre }}</td>
              @if (auth.esStaff()) { <td>{{ s.usuario.nombres }} {{ s.usuario.apellidos }}</td> }
              <td><app-estado-badge [nombre]="s.estado.nombre" /></td>
              <td class="text-end"><a class="btn btn-outline-primary btn-sm" [routerLink]="['/solicitudes', s.idSolicitud]">Ver</a></td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="text-center text-muted py-4">No hay solicitudes registradas.</td></tr>
          }
        </tbody>
      </table>
    </div></div>
  `
})
export class SolicitudesComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  solicitudes: Solicitud[] = [];
  estadosDisponibles = ['REGISTRADA', 'EN_REVISION', 'OBSERVADA', 'EN_PROCESO', 'FINALIZADA', 'RECHAZADA'];
  filtro = ''; error = '';

  get filtradas() {
    return this.filtro ? this.solicitudes.filter((s) => s.estado.nombre === this.filtro) : this.solicitudes;
  }

  ngOnInit() {
    this.api.solicitudes().subscribe({
      next: (s) => (this.solicitudes = s),
      error: (e) => (this.error = mensajeError(e))
    });
  }
}
