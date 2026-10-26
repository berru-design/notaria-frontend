import { Component, Input } from '@angular/core';

const COLORES: Record<string, string> = {
  REGISTRADA: 'secondary', EN_REVISION: 'info', OBSERVADA: 'warning',
  EN_PROCESO: 'primary', FINALIZADA: 'success', RECHAZADA: 'danger',
  PENDIENTE: 'warning', RESPONDIDA: 'success'
};

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  template: `<span [class]="'badge text-bg-' + color">{{ texto }}</span>`
})
export class EstadoBadgeComponent {
  @Input() nombre = '';
  get color() { return COLORES[this.nombre] ?? 'secondary'; }
  get texto() { return this.nombre.replace(/_/g, ' '); }
}
