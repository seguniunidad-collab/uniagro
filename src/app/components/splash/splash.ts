import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  imports: [],
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right">Seguros Universales</span></div>
    <div class="splash-body">
      <div class="sp-logos">
        <svg viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg" width="140" height="36">
          <text x="0" y="28" font-family="Arial,sans-serif" font-weight="900" font-size="30" fill="#fff" letter-spacing="-.5">uniagro</text>
          <line x1="39" y1="2" x2="39" y2="9" stroke="#75B052" stroke-width="2.5"/>
          <path d="M35 8 Q39 1 43 8" fill="#75B052"/>
        </svg>
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
