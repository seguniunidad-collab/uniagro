import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  imports: [],
  template: `
    <div class="sb"><span>uniagro</span><span><i class="ti ti-wifi"></i></span></div>
    <div class="splash-body">
      <div class="s-ring"><i class="ti ti-shield-check"></i></div>
      <div>
        <div class="s-logo">uni<span>agro</span></div>
        <div class="s-sub">Universales · Banco de Antigua</div>
      </div>
      <div class="s-tag">"Cada día en el campo merece tranquilidad."</div>
      <button class="s-cta" (click)="start()">
        <i class="ti ti-arrow-right" style="font-size:15px;vertical-align:-2px;margin-right:4px"></i>
        Empezar a proteger mi ganado
      </button>
      <div class="s-ft">Proceso 100% digital · Seguros Universales</div>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; flex: 1; }
    .splash-body { flex: 1; }
  `,
})
export class Splash {
  constructor(private router: Router) {}
  start() { this.router.navigate(['/menu']); }
}
