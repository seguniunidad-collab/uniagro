import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m4-condiciones',
  imports: [],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right">M4 · Condiciones</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hdr-brand"><div class="hdr-title">Agua y pastizal</div><div class="hdr-sub">Condiciones de la finca</div></div>
      <div class="hdr-logo"><svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" width="70" height="24"><text x="0" y="19" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" letter-spacing="-.5">uniagro</text><line x1="29" y1="1" x2="29" y2="6" stroke="#75B052" stroke-width="1.8"/><path d="M26 5 Q29 0 32 5" fill="#75B052"/></svg></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:50%"></div></div><div class="pgl"><span>Módulo 4 de 8</span><span class="pgl-pct">50%</span></div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-plant"></i>Pastizal y carga animal</div>
        <label><span class="req">*</span> ¿Tiene pasto propio?</label>
        <div class="pill-row" style="margin-top:4px">
          <div class="pill" [class.on]="st().tienePasto==='si'" (click)="set('tienePasto','si')">✓ Sí tiene</div>
          <div class="pill" [class.on]="st().tienePasto==='no'" (click)="set('tienePasto','no')">✕ No tiene</div>
        </div>
        <div class="g2" style="margin-top:8px">
          <div>
            <label>Área de pastizal</label>
            <input type="number" placeholder="0" [value]="st().areaP" (input)="set('areaP',getVal($event))" />
          </div>
          <div>
            <label>Unidad</label>
            <select [value]="st().unidadP" (change)="set('unidadP',getVal($event))">
              <option>Manzanas</option><option>Hectáreas</option>
            </select>
          </div>
        </div>
        <label>Total de animales en la finca</label>
        <input type="number" placeholder="0" [value]="st().totalAnim" (input)="set('totalAnim',getVal($event))" />
        <label>Carga animal (UGA/Mz) — calculado</label>
        <div [style.color]="cargaColor()" style="padding:8px 10px;background:var(--green3);border-radius:var(--rad);font-size:14px;font-weight:700;border:1px solid var(--green4)">
          {{ svc.cargaAnimal() ? svc.cargaAnimal() + ' UGA/Mz' : '— ingresa área y animales' }}
        </div>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-droplet"></i>Fuente de agua</div>
        <div style="font-size:11px;color:var(--txt2);margin-bottom:8px">Selecciona todas las que apliquen</div>
        <div class="pill-row">
          @for (f of fuentes; track f.val) {
            <div class="pill" [class.on-multi]="isAgua(f.val)" (click)="svc.toggleArray('fuentesAgua', f.val)">{{ f.label }}</div>
          }
        </div>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-wheat"></i>Alimentación</div>
        <label>Sistema principal</label>
        <div class="pill-row" style="margin-top:4px">
          @for (a of alimentacion; track a) {
            <div class="pill" [class.on]="st().alimentacion===a" (click)="set('alimentacion',a)">{{ a }}</div>
          }
        </div>
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:14px"></i></button>
    </div>
  `,
})
export class M4Condiciones {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;

  fuentes = [
    { val:'Pozo propio', label:'💧 Pozo propio' },
    { val:'Río', label:'🌊 Río / quebrada' },
    { val:'Nacimiento', label:'💦 Nacimiento' },
    { val:'Municipal', label:'🏙️ Municipal' },
    { val:'Pila', label:'🪣 Pila / cisterna' },
    { val:'Sin fuente', label:'❌ Sin fuente' },
  ];
  alimentacion = ['Pasto natural','Pasto mejorado','Concentrado','Silo','Mixto'];

  set(k: string, v: string) { this.svc.patch({ [k]: v } as any); }
  getVal(e: Event) { return (e.target as HTMLInputElement).value; }
  isAgua(v: string) { return this.st().fuentesAgua.includes(v); }
  cargaColor() {
    const c = parseFloat(this.svc.cargaAnimal() ?? '0');
    return c >= 2 ? 'var(--g600)' : c >= 1.3 ? 'var(--a600)' : c > 0 ? 'var(--r600)' : 'var(--ua)';
  }
  back() { window.history.back(); }
  next() { this.router.navigate(['/m5']); }
}
