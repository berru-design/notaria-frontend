import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">⚖ Notaría Lima</a>
        <button class="navbar-toggler" type="button" (click)="abierto = !abierto" aria-label="Menú">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [class.show]="abierto" (click)="abierto = false">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Servicios</a></li>
            @if (auth.estaLogueado()) {
              <li class="nav-item"><a class="nav-link" routerLink="/solicitudes" routerLinkActive="active">Solicitudes</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/consultas" routerLinkActive="active">Consultas</a></li>
            }
            @if (auth.esAdmin()) {
              <li class="nav-item"><a class="nav-link" routerLink="/admin/servicios" routerLinkActive="active">Admin: Servicios</a></li>
              <li class="nav-item"><a class="nav-link" routerLink="/admin/usuarios" routerLinkActive="active">Admin: Usuarios</a></li>
            }
          </ul>
          <ul class="navbar-nav">
            @if (auth.usuario(); as u) {
              <li class="nav-item"><span class="navbar-text me-3">{{ u.nombres }} <span class="badge text-bg-secondary">{{ u.rol }}</span></span></li>
              <li class="nav-item"><button class="btn btn-outline-light btn-sm" (click)="salir()">Salir</button></li>
            } @else {
              <li class="nav-item"><a class="nav-link" routerLink="/login">Ingresar</a></li>
              <li class="nav-item"><a class="btn btn-outline-light btn-sm" routerLink="/registro">Registrarse</a></li>
            }
          </ul>
        </div>
      </div>
    </nav>
    <main class="container py-4"><router-outlet /></main>
    <footer class="text-center text-muted small pb-4">Sistema web de gestión de servicios y consultas notariales · Lima, 2026</footer>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  abierto = false;

  salir() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
