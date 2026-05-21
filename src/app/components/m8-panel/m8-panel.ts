import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m8-panel',
  imports: [],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 8</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-chart-bar"></i></div>
      <div><div class="ht">Mi finca en números</div><div class="hs">Panel del productor</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:100%"></div></div><div class="pgl">Módulo 8 de 8 — Completado</div></div>
    <div class="body">
      <div class="stl">Semáforo de salud de la finca</div>
      <div class="sem sem-v"><div class="sem-row"><div class="sem-dot dv"></div><div><div class="st2">Hato en buen estado</div><div class="sd2">Inventario y registros al día. Sigue así.</div></div></div></div>
      <div class="sem sem-a"><div class="sem-row"><div class="sem-dot da"></div><div>
        <div class="st2">Carga animal por mejorar</div>
        <div class="sd2">{{ cargaMsg() }}</div>
      </div></div></div>
      <div class="sem sem-r" style="margin-bottom:14px"><div class="sem-row"><div class="sem-dot dr"></div><div><div class="st2">Profilaxis vence pronto</div><div class="sd2">Vitaminado en 3 días. Coordina con tu veterinario.</div></div></div></div>

      <div class="stl">Indicadores clave</div>
      <div class="kpi-row" style="margin-bottom:14px">
        <div class="kpi"><div class="kl">Inventario total</div><div class="kv">{{ totalCabezas() }}</div><div class="ku">cabezas</div></div>
        <div class="kpi"><div class="kl">Carga animal</div><div class="kv">{{ svc.cargaAnimal() ?? '—' }}</div><div class="ku">UGA/Mz</div></div>
        <div class="kpi"><div class="kl">% preñez</div><div class="kv">63%</div><div class="ku">meta 95%</div></div>
        <div class="kpi"><div class="kl">Mortalidad</div><div class="kv">4.0%</div><div class="ku">meta 2%</div></div>
      </div>

      <div class="stl">Retos BDA — progreso 2025</div>
      @for (r of retos; track r.nombre) {
        <div class="reto-card">
          <div class="reto-hdr"><div class="reto-name">{{ r.nombre }}</div><div class="reto-pct">{{ r.pct }}%</div></div>
          <div class="reto-bar"><div class="reto-fill" [style.width]="r.pct+'%'"></div></div>
          <div class="reto-vals"><div class="reto-val">Actual: {{ r.actual }}</div><div class="reto-val">Meta: {{ r.meta }}</div></div>
        </div>
      }

      <div class="stl" style="margin-top:4px">Inventario por lote</div>
      @for (inv of inventario; track inv.nombre) {
        <div class="inv-row">
          <div class="inv-dot" [style.background]="inv.color"></div>
          <div class="inv-name">{{ inv.nombre }}</div>
          <div class="inv-cnt">{{ inv.cnt }}</div>
        </div>
      }

      <div class="quote" style="margin-top:14px">"Tu esfuerzo merece respaldo real. Protege hoy lo que te da de vivir."</div>
      <button class="btn-cotiz"><i class="ti ti-shield-check" style="font-size:16px"></i>Solicitar cotización de seguro</button>
      <button class="btn-nuevo" (click)="menu()"><i class="ti ti-layout-grid" style="font-size:14px;vertical-align:-2px;margin-right:4px"></i>Volver al menú principal</button>
    </div>
  `,
})
export class M8Panel {
  svc = inject(StateService);
  router = inject(Router);

  retos = [
    { nombre: '1er reto — Preñez 95%', pct: 63, actual: '63%', meta: '95%' },
    { nombre: '2do reto — Peso 500 lb / 7 meses', pct: 82, actual: '410 lb', meta: '500 lb' },
    { nombre: '3er reto — Carga 2.5 UGA/Mz', pct: 52, actual: '1.3', meta: '2.5' },
  ];

  inventario = [
    { nombre: 'Vacas en producción', cnt: 32, color: 'var(--ua)' },
    { nombre: 'Becerros 0–3 meses', cnt: 18, color: '#3B6D11' },
    { nombre: 'Novillas', cnt: 15, color: '#854F0B' },
    { nombre: 'Toros', cnt: 4, color: '#888780' },
    { nombre: 'Enfermería', cnt: 2, color: '#A32D2D' },
  ];

  totalCabezas() {
    const sum = this.svc.state().animales.reduce((acc, a) => acc + (parseInt(a.cant) || 0), 0);
    return sum || 87;
  }

  cargaMsg() {
    const c = this.svc.cargaAnimal();
    if (c) return `${c} UGA/Mz actual vs meta 2.5. Rotar potreros puede ayudar.`;
    return '1.3 UGA/Mz actual vs meta 2.5. Rotar potreros puede ayudar.';
  }

  back() { this.router.navigate(['/m7']); }
  menu() { this.router.navigate(['/menu']); }
}
