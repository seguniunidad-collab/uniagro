import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';
import { SearchDropdown } from '../search-dropdown/search-dropdown';
import { AGENCIAS } from '../../services/data';

@Component({
  selector: 'app-m1-ganadero',
  imports: [FormsModule, SearchDropdown],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right">M1 · Ganadero</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hdr-brand"><div class="hdr-title">Registro del ganadero</div><div class="hdr-sub">Datos personales y vinculación</div></div>
      <div class="hdr-logo"><svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" width="70" height="24"><text x="0" y="19" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" letter-spacing="-.5">uniagro</text><line x1="29" y1="1" x2="29" y2="6" stroke="#75B052" stroke-width="1.8"/><path d="M26 5 Q29 0 32 5" fill="#75B052"/></svg></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:12%"></div></div><div class="pgl"><span>Módulo 1 de 8</span><span class="pgl-pct">12%</span></div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-user-circle"></i>Datos personales</div>
        <label><span class="req">*</span> Nombre completo <span class="hint">(texto)</span></label>
        <input type="text" placeholder="Juan Pérez López" [value]="st().nombre" (input)="set('nombre',$event)" />

        <div class="g2" style="margin-top:0">
          <div>
            <label><span class="req">*</span> DPI — Número <span class="hint">(8 dígitos)</span></label>
            <input type="number" placeholder="12345678" [value]="st().dpi1" (input)="set('dpi1',$event)" />
          </div>
          <div>
            <label><span class="req">*</span> DPI — Complemento</label>
            <input type="number" placeholder="0101" [value]="st().dpi2" (input)="set('dpi2',$event)" />
          </div>
        </div>

        <label><span class="req">*</span> NIT <span class="hint">(alfanumérico)</span></label>
        <input type="text" placeholder="1234567-8 o CF" [value]="st().nit" (input)="set('nit',$event)" />

        <label><span class="req">*</span> Teléfono <span class="hint">(numérico)</span></label>
        <input type="number" placeholder="50200000000" [value]="st().telefono" (input)="set('telefono',$event)" />
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-credit-card"></i>Vinculación Bantigua</div>
        <label><span class="req">*</span> Número de crédito</label>
        <input type="text" placeholder="Ej. BDA-2025-00123" [value]="st().credito" (input)="set('credito',$event)" />
        <label>Agencia <span class="hint">(busca por nombre)</span></label>
        <app-search-dropdown [items]="agencias" placeholder="Escribe para buscar agencia..."
          [value]="st().agencia" (valueChange)="svc.patch({agencia:$event})">
        </app-search-dropdown>
      </div>

      <div class="note note-r"><i class="ti ti-asterisk" style="font-size:11px;vertical-align:-1px;margin-right:4px"></i>Campos marcados con * son obligatorios</div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:14px"></i></button>
    </div>
  `,
})
export class M1Ganadero {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;
  agencias = AGENCIAS;
  set(k: string, e: Event) { this.svc.patch({ [k]: (e.target as HTMLInputElement).value } as any); }
  back() { this.router.navigate(['/menu']); }
  next() { this.router.navigate(['/m2']); }
}
