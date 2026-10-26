import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Consulta, RespuestaConsulta } from '../../core/models';
import { mensajeError } from '../../core/util';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [DatePipe, FormsModule, EstadoBadgeComponent],
  template: `
    <h2 class="h4 mb-3">{{ auth.esStaff() ? 'Consultas de clientes' : 'Mis consultas' }}</h2>
    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (ok) { <div class="alert alert-success">{{ ok }}</div> }

    @if (auth.esCliente()) {
      <div class="card shadow-sm mb-4"><div class="card-body">
        <h3 class="h6">Nueva consulta</h3>
        <form (ngSubmit)="registrar()" #f="ngForm">
          <div class="mb-2"><input class="form-control" name="asunto" [(ngModel)]="nueva.asunto" placeholder="Asunto" required maxlength="150"></div>
          <div class="mb-2"><textarea class="form-control" rows="3" name="descripcion" [(ngModel)]="nueva.descripcion" placeholder="Escriba su consulta" required></textarea></div>
          <button class="btn btn-primary btn-sm" [disabled]="f.invalid">Enviar consulta</button>
        </form>
      </div></div>
    }

    @for (c of consultas; track c.idConsulta) {
      <div class="card shadow-sm mb-2">
        <div class="card-header d-flex justify-content-between align-items-center" role="button" (click)="toggle(c)">
          <div>
            <strong>{{ c.asunto }}</strong>
            <div class="small text-muted">
              {{ c.fechaRegistro | date: 'dd/MM/yyyy HH:mm' }}
              @if (auth.esStaff()) { · {{ c.usuario.nombres }} {{ c.usuario.apellidos }} }
            </div>
          </div>
          <app-estado-badge [nombre]="c.estado" />
        </div>
        @if (abierta === c.idConsulta) {
          <div class="card-body">
            <p>{{ c.descripcion }}</p>
            <hr>
            @for (r of respuestas; track r.idRespuesta) {
              <div class="bg-light border rounded p-2 mb-2">
                <div class="small text-muted">{{ r.usuario.nombres }} {{ r.usuario.apellidos }} · {{ r.fechaRespuesta | date: 'dd/MM/yyyy HH:mm' }}</div>
                {{ r.respuesta }}
              </div>
            } @empty { <p class="text-muted small">Aún no hay respuestas.</p> }
            @if (auth.esStaff()) {
              <div class="mt-2">
                <textarea class="form-control mb-2" rows="2" [(ngModel)]="textoRespuesta" placeholder="Escriba su respuesta"></textarea>
                <button class="btn btn-success btn-sm" [disabled]="!textoRespuesta.trim()" (click)="responder(c)">Responder</button>
              </div>
            }
          </div>
        }
      </div>
    } @empty {
      <p class="text-center text-muted">No hay consultas registradas.</p>
    }
  `
})
export class ConsultasComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  consultas: Consulta[] = [];
  respuestas: RespuestaConsulta[] = [];
  abierta: number | null = null;
  nueva = { asunto: '', descripcion: '' };
  textoRespuesta = '';
  error = ''; ok = '';

  ngOnInit() { this.cargar(); }

  cargar() {
    this.api.consultas().subscribe({
      next: (c) => (this.consultas = c),
      error: (e) => (this.error = mensajeError(e))
    });
  }

  registrar() {
    this.error = ''; this.ok = '';
    this.api.registrarConsulta(this.nueva).subscribe({
      next: () => { this.ok = 'Consulta enviada. Será atendida por el personal de la notaría.'; this.nueva = { asunto: '', descripcion: '' }; this.cargar(); },
      error: (e) => (this.error = mensajeError(e))
    });
  }

  toggle(c: Consulta) {
    if (this.abierta === c.idConsulta) { this.abierta = null; return; }
    this.abierta = c.idConsulta;
    this.textoRespuesta = '';
    this.cargarRespuestas(c.idConsulta);
  }

  private cargarRespuestas(id: number) {
    this.respuestas = [];
    this.api.respuestas(id).subscribe((r) => (this.respuestas = r));
  }

  responder(c: Consulta) {
    this.error = ''; this.ok = '';
    this.api.responder(c.idConsulta, this.textoRespuesta).subscribe({
      next: () => { this.ok = 'Respuesta enviada.'; this.textoRespuesta = ''; this.cargarRespuestas(c.idConsulta); this.cargar(); },
      error: (e) => (this.error = mensajeError(e))
    });
  }
}
