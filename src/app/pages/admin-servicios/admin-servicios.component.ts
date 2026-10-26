import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { RequisitoServicio, ServicioNotarial } from '../../core/models';
import { mensajeError } from '../../core/util';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="h4 mb-3">Gestión de servicios notariales</h2>
    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (ok) { <div class="alert alert-success">{{ ok }}</div> }

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="card shadow-sm"><div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light"><tr><th>Servicio</th><th class="text-end">Acciones</th></tr></thead>
            <tbody>
              @for (s of servicios; track s.idServicio) {
                <tr [class.table-active]="seleccionado?.idServicio === s.idServicio">
                  <td><strong>{{ s.nombre }}</strong><div class="small text-muted">{{ s.descripcion }}</div></td>
                  <td class="text-end text-nowrap">
                    <button class="btn btn-outline-secondary btn-sm me-1" (click)="verRequisitos(s)">Requisitos</button>
                    <button class="btn btn-outline-primary btn-sm me-1" (click)="editar(s)">Editar</button>
                    <button class="btn btn-outline-danger btn-sm" (click)="desactivar(s)">Desactivar</button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="2" class="text-center text-muted py-4">No hay servicios activos.</td></tr> }
            </tbody>
          </table>
        </div></div>

        @if (seleccionado) {
          <div class="card shadow-sm mt-3"><div class="card-body">
            <h3 class="h6">Requisitos de: {{ seleccionado.nombre }}</h3>
            <ul class="list-group mb-3">
              @for (r of requisitos; track r.idRequisito) {
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>{{ r.descripcion }}
                    @if (r.obligatorio) { <span class="badge text-bg-danger">Obligatorio</span> }
                    @else { <span class="badge text-bg-secondary">Opcional</span> }
                  </span>
                  <button class="btn btn-outline-danger btn-sm" (click)="quitarRequisito(r)">Quitar</button>
                </li>
              } @empty { <li class="list-group-item text-muted">Sin requisitos registrados.</li> }
            </ul>
            <div class="input-group">
              <input class="form-control" [(ngModel)]="nuevoReq.descripcion" placeholder="Nuevo requisito">
              <div class="input-group-text">
                <input class="form-check-input mt-0 me-1" type="checkbox" [(ngModel)]="nuevoReq.obligatorio"> Obligatorio
              </div>
              <button class="btn btn-primary" [disabled]="!nuevoReq.descripcion.trim()" (click)="agregarRequisito()">Agregar</button>
            </div>
          </div></div>
        }
      </div>

      <div class="col-lg-5">
        <div class="card shadow-sm"><div class="card-body">
          <h3 class="h6">{{ form.idServicio ? 'Editar servicio' : 'Nuevo servicio' }}</h3>
          <form (ngSubmit)="guardar()" #f="ngForm">
            <div class="mb-2"><label class="form-label">Nombre</label>
              <input class="form-control" name="nombre" [(ngModel)]="form.nombre" required></div>
            <div class="mb-2"><label class="form-label">Descripción</label>
              <textarea class="form-control" rows="3" name="descripcion" [(ngModel)]="form.descripcion"></textarea></div>
            <div class="mb-3"><label class="form-label">Requisitos generales</label>
              <textarea class="form-control" rows="2" name="requisitos" [(ngModel)]="form.requisitos"></textarea></div>
            <button class="btn btn-primary btn-sm me-2" [disabled]="f.invalid">Guardar</button>
            @if (form.idServicio) { <button type="button" class="btn btn-outline-secondary btn-sm" (click)="nuevo()">Cancelar</button> }
          </form>
        </div></div>
      </div>
    </div>
  `
})
export class AdminServiciosComponent implements OnInit {
  private api = inject(ApiService);
  servicios: ServicioNotarial[] = [];
  requisitos: RequisitoServicio[] = [];
  seleccionado: ServicioNotarial | null = null;
  form: ServicioNotarial = { nombre: '', descripcion: '', requisitos: '' };
  nuevoReq: RequisitoServicio = { descripcion: '', obligatorio: true };
  error = ''; ok = '';

  ngOnInit() { this.cargar(); }

  cargar() { this.api.servicios().subscribe((s) => (this.servicios = s)); }

  nuevo() { this.form = { nombre: '', descripcion: '', requisitos: '' }; }

  editar(s: ServicioNotarial) { this.form = { ...s }; }

  guardar() {
    this.error = ''; this.ok = '';
    const op = this.form.idServicio
      ? this.api.actualizarServicio(this.form.idServicio, this.form)
      : this.api.crearServicio(this.form);
    op.subscribe({
      next: () => { this.ok = 'Servicio guardado.'; this.nuevo(); this.cargar(); },
      error: (e) => (this.error = mensajeError(e))
    });
  }

  desactivar(s: ServicioNotarial) {
    if (!confirm(`¿Desactivar el servicio "${s.nombre}"? Dejará de mostrarse en el catálogo.`)) return;
    this.api.desactivarServicio(s.idServicio!).subscribe({
      next: () => { this.ok = 'Servicio desactivado.'; if (this.seleccionado?.idServicio === s.idServicio) this.seleccionado = null; this.cargar(); },
      error: (e) => (this.error = mensajeError(e))
    });
  }

  verRequisitos(s: ServicioNotarial) {
    this.seleccionado = s;
    this.api.requisitos(s.idServicio!).subscribe((r) => (this.requisitos = r));
  }

  agregarRequisito() {
    this.api.agregarRequisito(this.seleccionado!.idServicio!, this.nuevoReq).subscribe({
      next: () => { this.nuevoReq = { descripcion: '', obligatorio: true }; this.verRequisitos(this.seleccionado!); },
      error: (e) => (this.error = mensajeError(e))
    });
  }

  quitarRequisito(r: RequisitoServicio) {
    this.api.desactivarRequisito(r.idRequisito!).subscribe({
      next: () => this.verRequisitos(this.seleccionado!),
      error: (e) => (this.error = mensajeError(e))
    });
  }
}
