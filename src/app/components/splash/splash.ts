import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  imports: [],
  template: `
    <div class="sb"><span>uniagro</span><span>v2.0</span></div>
    <div class="splash-body">
      <div class="sp-logos">
        <div class="sp-logo-ua">uni<span>agro</span></div>
        <div class="sp-sep"></div>
        <div class="sp-logo-bda">
          <div class="bda-name">BANTIGUA</div>
          <div class="bda-sub">Banco de Antigua</div>
        </div>
      </div>
      <div class="s-ring"><i class="ti ti-shield-check"></i></div>
      <div style="font-size:11px;color:#a8c8e8;letter-spacing:.06em;text-transform:uppercase">Seguros Universales</div>
      <div class="s-tag">"Cada día en el campo merece tranquilidad."</div>
      <button class="s-cta" (click)="start()">
        <i class="ti ti-arrow-right" style="font-size:14px;vertical-align:-2px;margin-right:5px"></i>
        Empezar a proteger mi ganado
      </button>
      <div class="s-ft">Proceso 100% digital · Seguros Universales</div>
    </div>
  `,
  styles: `:host{display:flex;flex-direction:column;flex:1} .splash-body{flex:1}`,
})
export class Splash {
  constructor(private router: Router) {}
  start() { this.router.navigate(['/menu']); }
}
