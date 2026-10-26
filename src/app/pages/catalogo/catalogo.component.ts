import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { RequisitoServicio, ServicioNotarial } from '../../core/models';
import { mensajeError } from '../../core/util';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center mb-4">
      <h1 class="h2">Servicios notariales</h1>
      <p class="text-muted">Conozca los requisitos y registre su solicitud en línea.</p>
    </div>
    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    <div class="row g-3">
      @for (s of servicios; track s.idServicio) {
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ s.nombre }}</h5>
              <p class="card-text">{{ s.descripcion }}</p>
              @if (s.requisitos) {
                <p class="small text-muted"><strong>Requisitos generales:</strong> {{ s.requisitos }}</p>
              }
              @if (abiertos[s.idServicio!]; as reqs) {
                <ul class="small ps-3">
                  @for (r of reqs; track r.idRequisito) {
                    <li>{{ r.descripcion }}
                      @if (r.obligatorio) { <span class="badge text-bg-danger">Obligatorio</span> }
                      @else { <span class="badge text-bg-secondary">Opcional</span> }
                    </li>
                  } @empty { <li>Sin requisitos detallados.</li> }
                </ul>
              }
              <div class="mt-auto d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm" (click)="toggle(s)">
                  {{ abiertos[s.idServicio!] ? 'Ocultar requisitos' : 'Ver requisitos' }}
                </button>
                @if (!auth.esStaff()) {
                  <a class="btn btn-primary btn-sm"
                     [routerLink]="auth.estaLogueado() ? '/solicitudes/nueva' : '/login'"
                     [queryParams]="auth.estaLogueado() ? { servicio: s.idServicio } : { returnUrl: '/solicitudes/nueva?servicio=' + s.idServicio }">
                    Solicitar
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      } @empty {
        <p class="text-center text-muted">No hay servicios disponibles por el momento.</p>
      }
    </div>
  `
})
export class CatalogoComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  servicios: ServicioNotarial[] = [];
  abiertos: Record<number, RequisitoServicio[] | undefined> = {};
  error = '';

  ngOnInit() {
    this.api.servicios().subscribe({
      next: (s) => (this.servicios = s),
      error: (e) => (this.error = mensajeError(e))
    });
  }

  toggle(s: ServicioNotarial) {
    const id = s.idServicio!;
    if (this.abiertos[id]) { this.abiertos[id] = undefined; return; }
    this.api.requisitos(id).subscribe((r) => (this.abiertos[id] = r));
  }
}
