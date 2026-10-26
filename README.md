# Frontend – Sistema web de servicios y consultas notariales (Lima, 2026)

Angular 17 (standalone) · TypeScript · Bootstrap 5

## Ejecutar
1. Tener el backend corriendo en http://localhost:8080
2. `npm install`
3. `npm start`  → http://localhost:4200

La URL del backend se cambia en `src/environments/environment.ts`.

## Estructura
- `core/`    modelos, servicios HTTP (`api.service.ts`), autenticación JWT, interceptor y guards por rol
- `shared/`  componentes reutilizables (badge de estado)
- `pages/`   pantallas: catálogo, login, registro, solicitudes, detalle, consultas, admin (servicios y usuarios)

## Pantallas por rol
| Rol | Acceso |
|---|---|
| Público | Catálogo de servicios y requisitos, login, registro |
| CLIENTE | Nueva solicitud, mis solicitudes + historial, consultas |
| PERSONAL | Bandeja de solicitudes, cambio de estado, responder consultas |
| ADMINISTRADOR | Todo lo anterior + gestión de servicios, requisitos y usuarios |
