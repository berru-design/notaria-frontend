import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { RegistroRequest, Rol, Usuario } from '../../core/models';
import { mensajeError } from '../../core/util';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="h4 mb-3">Gestión de usuarios</h2>
    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (ok) { <div class="alert alert-success">{{ ok }}</div> }

    <div class="row g-3">
      <div class="col-lg-8">
        <div class="card shadow-sm"><div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light"><tr><th>Nombre</th><th>DNI</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              @for (u of usuarios; track u.idUsuario) {
                <tr>
                  <td>{{ u.nombres }} {{ u.apellidos }}</td>
                  <td>{{ u.dni }}</td>
                  <td>{{ u.correo }}</td>
                  <td><span class="badge text-bg-secondary">{{ u.rol.nombre }}</span></td>
                  <td>
                    @if (u.estado) { <span class="badge text-bg-success">Activo</span> }
                    @else { <span class="badge text-bg-danger">Inactivo</span> }
                  </td>
                  <td class="text-end">
                    <button class="btn btn-outline-secondary btn-sm" (click)="alternar(u)">{{ u.estado ? 'Desactivar' : 'Activar' }}</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div></div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm"><div class="card-body">
          <h3 class="h6">Nuevo usuario</h3>
          <form (ngSubmit)="crear()" #f="ngForm">
            <input class="form-control mb-2" name="nombres" [(ngModel)]="d.nombres" placeholder="Nombres" required>
            <input class="form-control mb-2" name="apellidos" [(ngModel)]="d.apellidos" placeholder="Apellidos" required>
            <input class="form-control mb-2" name="dni" [(ngModel)]="d.dni" placeholder="DNI (8 dígitos)" required pattern="[0-9]{8}" maxlength="8">
            <input type="email" class="form-control mb-2" name="correo" [(ngModel)]="d.correo" placeholder="Correo" required>
            <input type="password" class="form-control mb-2" name="clave" [(ngModel)]="d.clave" placeholder="Clave (mín. 6)" required minlength="6">
            <select class="form-select mb-3" name="rol" [(ngModel)]="d.idRol" required>
              <option [ngValue]="null" disabled>Rol...</option>
              @for (r of roles; track r.idRol) { <option [ngValue]="r.idRol">{{ r.nombre }}</option> }
            </select>
            <button class="btn btn-primary btn-sm" [disabled]="f.invalid">Crear usuario</button>
          </form>
        </div></div>
      </div>
    </div>
  `
})
export class AdminUsuariosComponent implements OnInit {
  private api = inject(ApiService);
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  d: RegistroRequest = this.vacio();
  error = ''; ok = '';

  private vacio(): RegistroRequest {
    return { nombres: '', apellidos: '', dni: '', correo: '', clave: '', idRol: null };
  }

  ngOnInit() {
    this.cargar();
    this.api.roles().subscribe((r) => (this.roles = r));
  }

  cargar() { this.api.usuarios().subscribe((u) => (this.usuarios = u)); }

  crear() {
    this.error = ''; this.ok = '';
    this.api.crearUsuario(this.d).subscribe({
      next: () => { this.ok = 'Usuario creado.'; this.d = this.vacio(); this.cargar(); },
      error: (e) => (this.error = mensajeError(e))
    });
  }

  alternar(u: Usuario) {
    this.error = ''; this.ok = '';
    this.api.estadoUsuario(u.idUsuario, !u.estado).subscribe({
      next: () => this.cargar(),
      error: (e) => (this.error = mensajeError(e))
    });
  }
}
