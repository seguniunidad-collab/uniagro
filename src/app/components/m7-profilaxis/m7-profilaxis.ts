import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m7-profilaxis',
  imports: [],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 7</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-heart-rate-monitor"></i></div>
      <div><div class="ht">Profilaxis</div><div class="hs">Plan sanitario del hato</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:87%"></div></div><div class="pgl">Módulo 7 de 8</div></div>
    <div class="body">
      <div class="stl">Próximos eventos — vacas</div>
      <div class="prox-item prox-r">
        <div class="prox-day">Día<br>540</div>
        <div style="flex:1"><div class="prox-ev">Vitaminado</div><div class="prox-dt">Vence en 3 días · Sagraymic + Doranic ad3e</div></div>
        <i class="ti ti-clock" style="font-size:16px;color:var(--r600)"></i>
      </div>
      <div class="prox-item prox-a">
        <div class="prox-day">Día<br>600</div>
        <div style="flex:1"><div class="prox-ev">Tratamiento celo F1</div><div class="prox-dt">En 2 semanas · Prostaglandina · Kyrofosan</div></div>
        <i class="ti ti-calendar" style="font-size:16px;color:var(--a600)"></i>
      </div>
      <div class="prox-item prox-g">
        <div class="prox-day">Día<br>630</div>
        <div style="flex:1"><div class="prox-ev">Palpado</div><div class="prox-dt">En 1 mes · Diagnóstico de preñez</div></div>
        <i class="ti ti-check" style="font-size:16px;color:var(--g600)"></i>
      </div>

      <div class="stl" style="margin-top:4px">Plan becerros — progreso del ciclo</div>
      <div class="bar-chart">
        @for (b of barras; track b.lbl) {
          <div class="bar-row">
            <div class="bar-lbl">{{ b.lbl }}</div>
            <div class="bar-track"><div class="bar-fill" [style.width]="b.pct+'%'"><span>{{ b.dia }}</span></div></div>
          </div>
        }
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-file-invoice"></i>Costo profilaxis estimado</div>
        <div class="kpi-row">
          <div class="kpi"><div class="kl">Vacas / ciclo</div><div class="kv">Q1,504</div></div>
          <div class="kpi"><div class="kl">Becerros / cabeza</div><div class="kv">Q568</div></div>
        </div>
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:15px"></i></button>
      <button class="bn" (click)="next()">Ver mi panel <i class="ti ti-chart-bar" style="font-size:15px"></i></button>
    </div>
  `,
})
export class M7Profilaxis {
  svc = inject(StateService);
  router = inject(Router);
  barras = [
    { lbl: 'Vitaminado', pct: 85, dia: 'Día 30' },
    { lbl: 'Bañado', pct: 60, dia: 'Día 45' },
    { lbl: 'Marcado', pct: 38, dia: 'Día 120' },
    { lbl: 'Destete', pct: 18, dia: 'Día 210' },
  ];
  back() { this.router.navigate(['/m6']); }
  next() { this.router.navigate(['/m8']); }
}
