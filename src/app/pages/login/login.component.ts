import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensajeError } from '../../core/util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm"><div class="card-body p-4">
          <h2 class="h4 mb-3">Iniciar sesión</h2>
          @if (error) { <div class="alert alert-danger">{{ error }}</div> }
          <form (ngSubmit)="entrar()" #f="ngForm">
            <div class="mb-3">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" name="correo" [(ngModel)]="correo" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Clave</label>
              <input type="password" class="form-control" name="clave" [(ngModel)]="clave" required>
            </div>
            <button class="btn btn-primary w-100" [disabled]="f.invalid || cargando">
              {{ cargando ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>
          <p class="mt-3 mb-0 text-center">¿No tiene cuenta? <a routerLink="/registro">Regístrese</a></p>
        </div></div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  correo = ''; clave = ''; error = ''; cargando = false;

  entrar() {
    this.cargando = true; this.error = '';
    this.auth.login(this.correo, this.clave).subscribe({
      next: () => this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? '/solicitudes'),
      error: (e) => { this.error = mensajeError(e); this.cargando = false; }
    });
  }
}
