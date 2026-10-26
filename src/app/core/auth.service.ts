import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, RegistroRequest, Usuario } from './models';

const KEY = 'notaria_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  usuario = signal<AuthResponse | null>(this.cargar());
  estaLogueado = computed(() => this.usuario() !== null);
  rol = computed(() => this.usuario()?.rol ?? null);
  esAdmin = computed(() => this.rol() === 'ADMINISTRADOR');
  esCliente = computed(() => this.rol() === 'CLIENTE');
  esStaff = computed(() => this.rol() === 'ADMINISTRADOR' || this.rol() === 'PERSONAL');

  get token(): string | null { return this.usuario()?.token ?? null; }

  login(correo: string, clave: string) {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, { correo, clave }).pipe(
      tap((r) => {
        localStorage.setItem(KEY, JSON.stringify(r));
        this.usuario.set(r);
      })
    );
  }

  registro(datos: RegistroRequest) {
    return this.http.post<Usuario>(`${this.api}/auth/registro`, datos);
  }

  logout() {
    localStorage.removeItem(KEY);
    this.usuario.set(null);
  }

  private cargar(): AuthResponse | null {
    try {
      const s = localStorage.getItem(KEY);
      return s ? (JSON.parse(s) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
