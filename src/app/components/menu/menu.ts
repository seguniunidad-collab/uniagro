import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right"><i class="ti ti-user-circle" style="font-size:14px"></i></span></div>
    <div class="hdr" style="padding-bottom:14px">
      <div class="hdr-brand"><div class="hdr-title">Mis módulos</div><div class="hdr-sub">¿Qué quieres registrar hoy?</div></div>
      <div class="hdr-logo"><svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" width="70" height="24"><text x="0" y="19" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" letter-spacing="-.5">uniagro</text><line x1="29" y1="1" x2="29" y2="6" stroke="#75B052" stroke-width="1.8"/><path d="M26 5 Q29 0 32 5" fill="#75B052"/></svg></div>
    </div>
    <div class="body">
      <div class="stl">Registro del productor</div>
      <div class="modul-grid">
        <div class="mc" (click)="go('/m1')"><div class="mc-num">1</div><i class="ti ti-user"></i><div class="mn">Ganadero</div><div class="ms">Datos personales</div></div>
        <div class="mc" (click)="go('/m2')"><div class="mc-num">2</div><i class="ti ti-home"></i><div class="mn">Finca</div><div class="ms">Ubicación y área</div></div>
        <div class="mc" (click)="go('/m3')"><div class="mc-num">3</div><i class="ti ti-garden-cart"></i><div class="mn">Hato</div><div class="ms">Mis animales</div></div>
        <div class="mc" (click)="go('/m4')"><div class="mc-num">4</div><i class="ti ti-droplet"></i><div class="mn">Condiciones</div><div class="ms">Agua y pasto</div></div>
      </div>
      <div class="stl" style="margin-top:4px">Gestión</div>
      <div class="modul-grid">
        <div class="mc" (click)="go('/m5')"><div class="mc-num">5</div><i class="ti ti-building"></i><div class="mn">Instalaciones</div><div class="ms">Estado y manejo</div></div>
        <div class="mc" (click)="go('/m7')"><div class="mc-num">7</div><i class="ti ti-heart-rate-monitor"></i><div class="mn">Profilaxis</div><div class="ms">Plan sanitario</div></div>
        <div class="mc" (click)="go('/m8')"><div class="mc-num">8</div><i class="ti ti-chart-bar"></i><div class="mn">Panel</div><div class="ms">Mi finca en números</div></div>
        <div class="mc agent-only" (click)="go('/m6')">
          <div class="mc-num">6</div><i class="ti ti-alert-triangle"></i>
          <div class="mn">Siniestros</div><div class="ms">Solo rol agente</div>
        </div>
      </div>
      <div class="quote">"Estamos contigo en cada paso del campo."</div>
    </div>
  `,
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
})
export class Menu {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigate([path]); }
}
