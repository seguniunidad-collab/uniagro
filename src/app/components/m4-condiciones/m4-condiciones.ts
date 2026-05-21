import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m4-condiciones',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 4</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-droplet"></i></div>
      <div><div class="ht">Agua y pastizal</div><div class="hs">Condiciones de la finca</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:50%"></div></div><div class="pgl">Módulo 4 de 8</div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-plant"></i>Pastizal y carga animal</div>
        <label>¿Tiene pasto propio?</label>
        <div class="yn-row">
          <div class="yn-btn" [class.si]="st().tienePasto==='si'" (click)="set('tienePasto','si')"><i class="ti ti-check"></i>Sí</div>
          <div class="yn-btn" [class.no]="st().tienePasto==='no'" (click)="set('tienePasto','no')"><i class="ti ti-x"></i>No</div>
        </div>
        <label>Área de pastizal (manzanas)</label>
        <input type="number" placeholder="0" [value]="st().areaP" (input)="set('areaP',getValue($event))" />
        <label>Total de animales en finca</label>
        <input type="number" placeholder="0" [value]="st().totalAnim" (input)="set('totalAnim',getValue($event))" />
        <label>Carga animal — calculado automático</label>
        <div [style.color]="cargaColor()" style="padding:8px 10px;background:var(--ua3);border-radius:var(--rad);font-size:14px;font-weight:600">
          {{ svc.cargaAnimal() ? svc.cargaAnimal() + ' UGA/Mz' : '— ingresa área y animales' }}
        </div>
      </div>
      <div class="card">
        <div class="ct"><i class="ti ti-droplet"></i>Fuente de agua</div>
        <label>¿Tiene pozo propio?</label>
        <div class="yn-row">
          <div class="yn-btn" [class.si]="st().tienePozo==='si'" (click)="set('tienePozo','si')"><i class="ti ti-check"></i>Sí</div>
          <div class="yn-btn" [class.no]="st().tienePozo==='no'" (click)="set('tienePozo','no')"><i class="ti ti-x"></i>No</div>
        </div>
        <label style="margin-top:10px">Tipo de fuente principal</label>
        <div class="pill-row" style="margin-top:6px">
          @for (op of fuentes; track op) {
            <div class="pill" [class.on]="st().fuenteAgua===op" (click)="set('fuenteAgua',op)">{{ op }}</div>
          }
        </div>
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:15px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:15px"></i></button>
    </div>
  `,
})
export class M4Condiciones {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;
  fuentes = ['Pozo','Río','Nacimiento','Municipal','Pila','Sin fuente'];

  set(key: string, val: string) { this.svc.patch({ [key]: val } as any); }
  getValue(e: Event) { return (e.target as HTMLInputElement).value; }

  cargaColor() {
    const c = parseFloat(this.svc.cargaAnimal() ?? '0');
    if (!c) return 'var(--ua)';
    return c >= 2 ? 'var(--g600)' : c >= 1.3 ? 'var(--a600)' : 'var(--r600)';
  }

  back() { this.router.navigate(['/m3']); }
  next() { this.router.navigate(['/m5']); }
}
