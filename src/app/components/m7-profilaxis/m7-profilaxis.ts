import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m7-profilaxis',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>M7</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-heart-rate-monitor"></i></div>
      <div><div class="ht">Profilaxis</div><div class="hs">Plan sanitario del hato</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:87%"></div></div><div class="pgl">Módulo 7 de 8</div></div>
    <div class="body">
      <div style="margin-bottom:10px">
        <label>Especie del hato</label>
        <div class="pill-row" style="margin-top:4px">
          @for (e of especies; track e.key) {
            <div class="pill" [class.on]="profEsp()===e.key" (click)="profEsp.set(e.key)">{{ e.label }}</div>
          }
        </div>
      </div>

      <div class="tabs">
        <button class="tab" [class.on]="tab()==='before'" (click)="tab.set('before')">Antes de asesoría</button>
        <button class="tab" [class.on]="tab()==='after'" (click)="tab.set('after')">Plan recomendado</button>
      </div>

      @if (tab()==='before') {
        <div class="stl">Situación actual del hato</div>
        <div class="card">
          <div class="ct"><i class="ti ti-clipboard-list"></i>Registro de manejo preventivo actual</div>

          <label>¿Tiene programa de vacunación?</label>
          <div class="yn-row">
            <button class="yn" [class.y]="st().tieneVacunacion==='si'" (click)="set('tieneVacunacion','si')"><i class="ti ti-check" style="font-size:13px"></i> Sí</button>
            <button class="yn" [class.n]="st().tieneVacunacion==='no'" (click)="set('tieneVacunacion','no')"><i class="ti ti-x" style="font-size:13px"></i> No</button>
          </div>

          <label>¿Tiene programa de desparasitación?</label>
          <div class="yn-row">
            <button class="yn" [class.y]="st().tieneDesparasitacion==='si'" (click)="set('tieneDesparasitacion','si')"><i class="ti ti-check" style="font-size:13px"></i> Sí</button>
            <button class="yn" [class.n]="st().tieneDesparasitacion==='no'" (click)="set('tieneDesparasitacion','no')"><i class="ti ti-x" style="font-size:13px"></i> No</button>
          </div>

          <label>¿Aplica vitaminas y minerales?</label>
          <div class="yn-row">
            <button class="yn" [class.y]="st().tieneVitaminas==='si'" (click)="set('tieneVitaminas','si')"><i class="ti ti-check" style="font-size:13px"></i> Sí</button>
            <button class="yn" [class.n]="st().tieneVitaminas==='no'" (click)="set('tieneVitaminas','no')"><i class="ti ti-x" style="font-size:13px"></i> No</button>
          </div>

          <label>Último tratamiento antiparasitario</label>
          <input type="date" [value]="st().ultimoTratamiento" (input)="set('ultimoTratamiento',getVal($event))" />

          <label>Observaciones sanitarias actuales</label>
          <textarea placeholder="Describe el manejo sanitario que realizas actualmente..."
            [value]="st().obsSanitarias" (input)="set('obsSanitarias',getVal($event))"></textarea>
        </div>
      }

      @if (tab()==='after') {
        <div class="stl">Plan recomendado — Bovinos</div>
        <div class="prof-ev pev-r"><div class="pev-d">Día<br>540</div><div style="flex:1"><div class="pev-ev">Vitaminado</div><div class="pev-dt">Sagraymic + Doranic ad3e · Vence en 3 días</div></div><i class="ti ti-clock" style="font-size:15px;color:var(--r600)"></i></div>
        <div class="prof-ev pev-a"><div class="pev-d">Día<br>600</div><div style="flex:1"><div class="pev-ev">Tratamiento celo F1</div><div class="pev-dt">Prostaglandina · En 2 semanas</div></div><i class="ti ti-calendar" style="font-size:15px;color:var(--a600)"></i></div>
        <div class="prof-ev pev-g"><div class="pev-d">Día<br>630</div><div style="flex:1"><div class="pev-ev">Palpado</div><div class="pev-dt">Diagnóstico de preñez · En 1 mes</div></div><i class="ti ti-check" style="font-size:15px;color:var(--g600)"></i></div>

        <div class="stl" style="margin-top:4px">Vacunación recomendada — Bovinos</div>
        <div class="card">
          <div class="ct"><i class="ti ti-vaccine"></i>Calendario básico</div>
          <div style="font-size:11px;color:var(--txt2);line-height:1.7">
            <b style="color:var(--ua5)">Terneras 3–8 meses:</b> Brucelosis (cepa RB51)<br>
            <b style="color:var(--ua5)">Desde 3–4 meses:</b> Clostridiales + Fiebre Aftosa<br>
            <b style="color:var(--ua5)">Vacas adultas/toros:</b> Refuerzo anual (Leptospirosis, IBR, BVD)<br>
            <b style="color:var(--ua5)">Vacas gestantes:</b> Vacunación 4–6 semanas antes del parto<br>
            <b style="color:var(--ua5)">Desparasitación:</b> 2–3 veces al año, rotando principio activo
          </div>
        </div>

        <div class="stl">Progreso — Becerros</div>
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
      }
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" (click)="next()">Ver mi panel <i class="ti ti-chart-bar" style="font-size:14px"></i></button>
    </div>
  `,
})
export class M7Profilaxis {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;
  tab = signal<'before'|'after'>('before');
  profEsp = signal('bovino');
  especies = [
    { key:'bovino', label:'🐄 Bovino' },
    { key:'porcino', label:'🐖 Porcino' },
    { key:'avicola_postura', label:'🥚 Aves postura' },
    { key:'avicola_engorda', label:'🍗 Aves engorda' },
  ];
  barras = [
    { lbl:'Vitaminado', pct:85, dia:'Día 30' },
    { lbl:'Bañado', pct:60, dia:'Día 45' },
    { lbl:'Marcado', pct:38, dia:'Día 120' },
    { lbl:'Destete', pct:18, dia:'Día 210' },
  ];
  set(k: string, v: string) { this.svc.patch({ [k]: v } as any); }
  getVal(e: Event) { return (e.target as HTMLInputElement).value; }
  back() { this.router.navigate(['/m5']); }
  next() { this.router.navigate(['/m8']); }
}
