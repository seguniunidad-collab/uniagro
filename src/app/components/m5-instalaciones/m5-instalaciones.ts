import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

const NIVELES = [
  { key:'Tecnificado', icon:'ti-building-factory', desc:'Corrales techados · equipo ordeño · sanidad establecida' },
  { key:'Semi-tecnificado', icon:'ti-tool', desc:'Infraestructura básica · registros parciales' },
  { key:'Tradicional / extensivo', icon:'ti-tree', desc:'Potrero · sin instalaciones formales' },
  { key:'En desarrollo', icon:'ti-seedling', desc:'Productor pequeño · instalaciones mínimas' },
];

@Component({
  selector: 'app-m5-instalaciones',
  imports: [],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right">M5 · Instalaciones</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hdr-brand"><div class="hdr-title">Instalaciones</div><div class="hdr-sub">Estado y tecnificación</div></div>
      <div class="hdr-logo"><svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" width="70" height="24"><text x="0" y="19" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" letter-spacing="-.5">uniagro</text><line x1="29" y1="1" x2="29" y2="6" stroke="#75B052" stroke-width="1.8"/><path d="M26 5 Q29 0 32 5" fill="#75B052"/></svg></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:62%"></div></div><div class="pgl"><span>Módulo 5 de 8</span><span class="pgl-pct">62%</span></div></div>
    <div class="body">
      <div class="stl">Nivel de tecnificación</div>
      @for (n of niveles; track n.key) {
        <div class="tec-item" [class.sel]="st().tecnificacion===n.key" (click)="set('tecnificacion',n.key)">
          <i class="ti {{ n.icon }}"></i>
          <div style="flex:1"><div class="tec-name">{{ n.key }}</div><div class="tec-desc">{{ n.desc }}</div></div>
          <div class="chk"></div>
        </div>
      }
      <div class="card" style="margin-top:4px">
        <div class="ct"><i class="ti ti-recycle"></i>Manejo de desechos</div>
        <div class="pill-row" style="margin-top:4px">
          @for (d of desechos; track d) {
            <div class="pill" [class.on-multi]="isDesecho(d)" (click)="svc.toggleArray('desechos',d)">{{ d }}</div>
          }
        </div>
      </div>
      <div class="card">
        <div class="ct"><i class="ti ti-list-check"></i>Estado general</div>
        <label style="margin-top:0">Observaciones de instalaciones <span class="hint">(texto libre)</span></label>
        <textarea placeholder="Describe el estado de corrales, bebederos, comederos, manga de trabajo..."
          [value]="st().obsInstalaciones" (input)="set('obsInstalaciones',getVal($event))"></textarea>
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:14px"></i></button>
    </div>
  `,
})
export class M5Instalaciones {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;
  niveles = NIVELES;
  desechos = ['Fosa séptica','Compostaje','Biodigestor','Laguna oxidación','Ninguno'];

  set(k: string, v: string) { this.svc.patch({ [k]: v } as any); }
  getVal(e: Event) { return (e.target as HTMLInputElement).value; }
  isDesecho(v: string) { return this.st().desechos.includes(v); }
  back() { window.history.back(); }
  next() { this.router.navigate(['/m7']); } // salta M6 (solo agente)
}
