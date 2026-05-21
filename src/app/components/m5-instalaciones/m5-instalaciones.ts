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
    <div class="sb"><span>uniagro</span><span>M5</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-building"></i></div>
      <div><div class="ht">Instalaciones</div><div class="hs">Estado y tecnificación</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:62%"></div></div><div class="pgl">Módulo 5 de 8</div></div>
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
  back() { this.router.navigate(['/m4']); }
  next() { this.router.navigate(['/m7']); } // salta M6 (solo agente)
}
