import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { RequisitoServicio, ServicioNotarial } from '../../core/models';
import { mensajeError } from '../../core/util';

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm"><div class="card-body p-4">
          <h2 class="h4 mb-3">Nueva solicitud</h2>
          @if (error) { <div class="alert alert-danger">{{ error }}</div> }
          <form (ngSubmit)="enviar()" #f="ngForm">
            <div class="mb-3">
              <label class="form-label">Servicio notarial</label>
              <select class="form-select" name="servicio" [(ngModel)]="idServicio" (ngModelChange)="cargarRequisitos()" required>
                <option [ngValue]="null" disabled>Seleccione un servicio...</option>
                @for (s of servicios; track s.idServicio) {
                  <option [ngValue]="s.idServicio">{{ s.nombre }}</option>
                }
              </select>
            </div>
            @if (requisitos.length) {
              <div class="alert alert-info">
                <strong>Documentos a presentar:</strong>
                <ul class="mb-0">
                  @for (r of requisitos; track r.idRequisito) {
                    <li>{{ r.descripcion }} @if (!r.obligatorio) { <em>(opcional)</em> }</li>
                  }
                </ul>
              </div>
            }
            <div class="mb-3">
              <label class="form-label">Detalle de su solicitud</label>
              <textarea class="form-control" rows="4" name="detalle" [(ngModel)]="detalle" placeholder="Describa brevemente su trámite"></textarea>
            </div>
            <button class="btn btn-primary" [disabled]="f.invalid || enviando">Registrar solicitud</button>
          </form>
        </div></div>
      </div>
    </div>
  `
})
export class NuevaSolicitudComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  servicios: ServicioNotarial[] = [];
  requisitos: RequisitoServicio[] = [];
  idServicio: number | null = null;
  detalle = ''; error = ''; enviando = false;

  ngOnInit() {
    this.api.servicios().subscribe((s) => {
      this.servicios = s;
      const q = Number(this.route.snapshot.queryParamMap.get('servicio'));
      if (q && s.some((x) => x.idServicio === q)) { this.idServicio = q; this.cargarRequisitos(); }
    });
  }

  cargarRequisitos() {
    this.requisitos = [];
    if (this.idServicio) this.api.requisitos(this.idServicio).subscribe((r) => (this.requisitos = r));
  }

  enviar() {
    if (!this.idServicio) return;
    this.enviando = true; this.error = '';
    this.api.registrarSolicitud({ idServicio: this.idServicio, detalle: this.detalle }).subscribe({
      next: (s) => this.router.navigate(['/solicitudes', s.idSolicitud]),
      error: (e) => { this.error = mensajeError(e); this.enviando = false; }
    });
  }
}
