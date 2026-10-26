import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { RegistroRequest } from '../../core/models';
import { mensajeError } from '../../core/util';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm"><div class="card-body p-4">
          <h2 class="h4 mb-3">Crear cuenta de cliente</h2>
          @if (error) { <div class="alert alert-danger">{{ error }}</div> }
          <form (ngSubmit)="registrar()" #f="ngForm">
            <div class="row">
              <div class="col-md-6 mb-3"><label class="form-label">Nombres</label>
                <input class="form-control" name="nombres" [(ngModel)]="d.nombres" required></div>
              <div class="col-md-6 mb-3"><label class="form-label">Apellidos</label>
                <input class="form-control" name="apellidos" [(ngModel)]="d.apellidos" required></div>
            </div>
            <div class="mb-3"><label class="form-label">DNI</label>
              <input class="form-control" name="dni" [(ngModel)]="d.dni" required pattern="[0-9]{8}" maxlength="8" placeholder="8 dígitos"></div>
            <div class="mb-3"><label class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" name="correo" [(ngModel)]="d.correo" required></div>
            <div class="mb-3"><label class="form-label">Clave (mínimo 6 caracteres)</label>
              <input type="password" class="form-control" name="clave" [(ngModel)]="d.clave" required minlength="6"></div>
            <button class="btn btn-primary w-100" [disabled]="f.invalid || cargando">Registrarme</button>
          </form>
          <p class="mt-3 mb-0 text-center">¿Ya tiene cuenta? <a routerLink="/login">Inicie sesión</a></p>
        </div></div>
      </div>
    </div>
  `
})
export class RegistroComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  d: RegistroRequest = { nombres: '', apellidos: '', dni: '', correo: '', clave: '' };
  error = ''; cargando = false;

  registrar() {
    this.cargando = true; this.error = '';
    this.auth.registro(this.d).subscribe({
      next: () => this.auth.login(this.d.correo, this.d.clave).subscribe({
        next: () => this.router.navigate(['/solicitudes']),
        error: () => this.router.navigate(['/login'])
      }),
      error: (e) => { this.error = mensajeError(e); this.cargando = false; }
    });
  }
}
