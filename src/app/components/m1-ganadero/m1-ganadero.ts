import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m1-ganadero',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 1</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-user"></i></div>
      <div><div class="ht">Registro del ganadero</div><div class="hs">Datos personales</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:12%"></div></div><div class="pgl">Módulo 1 de 8</div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-user-circle"></i>Datos personales</div>
        <label>Nombre completo</label>
        <input type="text" placeholder="Juan Pérez López" [(ngModel)]="st.nombre" (ngModelChange)="save('nombre',$event)" />
        <label>DPI / NIT</label>
        <input type="text" placeholder="Número de identificación" [(ngModel)]="st.dpi" (ngModelChange)="save('dpi',$event)" />
        <label>Teléfono</label>
        <input type="text" placeholder="+502 0000 0000" [(ngModel)]="st.telefono" (ngModelChange)="save('telefono',$event)" />
      </div>
      <div class="card">
        <div class="ct"><i class="ti ti-credit-card"></i>Vinculación Bantigua</div>
        <label>Número de crédito</label>
        <input type="text" placeholder="Ej. BDA-2025-00123" [(ngModel)]="st.credito" (ngModelChange)="save('credito',$event)" />
        <label>Agencia</label>
        <select [(ngModel)]="st.agencia" (ngModelChange)="save('agencia',$event)">
          <option value="">Seleccionar agencia</option>
          <option>Guatemala</option><option>Escuintla</option>
          <option>Retalhuleu</option><option>Petén</option><option>Alta Verapaz</option>
        </select>
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:15px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:15px"></i></button>
    </div>
  `,
})
export class M1Ganadero {
  svc = inject(StateService);
  router = inject(Router);
  st = { ...this.svc.state() };

  save(key: string, val: string) { this.svc.patch({ [key]: val } as any); }
  back() { this.router.navigate(['/menu']); }
  next() { this.router.navigate(['/m2']); }
}
