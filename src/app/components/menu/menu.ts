import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  template: `
    <div class="sb"><span>uniagro</span><span><i class="ti ti-user-circle" style="font-size:14px"></i></span></div>
    <div class="hdr" style="padding-bottom:14px">
      <div class="hico"><i class="ti ti-layout-grid"></i></div>
      <div><div class="ht">Mis módulos</div><div class="hs">¿Qué quieres registrar hoy?</div></div>
    </div>
    <div class="body">
      <div class="stl">Registro</div>
      <div class="modul-grid">
        <div class="mc" (click)="go('/m1')"><i class="ti ti-user"></i><div class="mn">Ganadero</div><div class="ms">Datos personales</div></div>
        <div class="mc" (click)="go('/m2')"><i class="ti ti-home"></i><div class="mn">Finca</div><div class="ms">Ubicación y área</div></div>
        <div class="mc" (click)="go('/m3')"><i class="ti ti-garden-cart"></i><div class="mn">Hato</div><div class="ms">Mis animales</div></div>
        <div class="mc" (click)="go('/m4')"><i class="ti ti-droplet"></i><div class="mn">Condiciones</div><div class="ms">Agua y pasto</div></div>
      </div>
      <div class="stl" style="margin-top:4px">Gestión</div>
      <div class="modul-grid">
        <div class="mc" (click)="go('/m5')"><i class="ti ti-building"></i><div class="mn">Instalaciones</div><div class="ms">Estado y manejo</div></div>
        <div class="mc" (click)="go('/m6')"><i class="ti ti-alert-triangle"></i><div class="mn">Siniestros</div><div class="ms">Reportar evento</div></div>
        <div class="mc" (click)="go('/m7')"><i class="ti ti-heart-rate-monitor"></i><div class="mn">Profilaxis</div><div class="ms">Plan sanitario</div></div>
        <div class="mc" (click)="go('/m8')"><i class="ti ti-chart-bar"></i><div class="mn">Panel</div><div class="ms">Mi finca en números</div></div>
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
