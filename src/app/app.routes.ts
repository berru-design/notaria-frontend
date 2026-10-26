import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full',
    loadComponent: () => import('./pages/catalogo/catalogo.component').then((m) => m.CatalogoComponent) },
  { path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  { path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then((m) => m.RegistroComponent) },
  { path: 'solicitudes', canActivate: [authGuard],
    loadComponent: () => import('./pages/solicitudes/solicitudes.component').then((m) => m.SolicitudesComponent) },
  { path: 'solicitudes/nueva', canActivate: [roleGuard('CLIENTE')],
    loadComponent: () => import('./pages/nueva-solicitud/nueva-solicitud.component').then((m) => m.NuevaSolicitudComponent) },
  { path: 'solicitudes/:id', canActivate: [authGuard],
    loadComponent: () => import('./pages/solicitud-detalle/solicitud-detalle.component').then((m) => m.SolicitudDetalleComponent) },
  { path: 'consultas', canActivate: [authGuard],
    loadComponent: () => import('./pages/consultas/consultas.component').then((m) => m.ConsultasComponent) },
  { path: 'admin/servicios', canActivate: [roleGuard('ADMINISTRADOR')],
    loadComponent: () => import('./pages/admin-servicios/admin-servicios.component').then((m) => m.AdminServiciosComponent) },
  { path: 'admin/usuarios', canActivate: [roleGuard('ADMINISTRADOR')],
    loadComponent: () => import('./pages/admin-usuarios/admin-usuarios.component').then((m) => m.AdminUsuariosComponent) },
  { path: '**', redirectTo: '' }
];
