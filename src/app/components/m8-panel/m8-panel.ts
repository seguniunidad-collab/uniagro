import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m8-panel',
  imports: [],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right">M8 · Panel</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hdr-brand"><div class="hdr-title">Mi finca en números</div><div class="hdr-sub">Panel del productor</div></div>
      <div class="hdr-logo"><svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" width="70" height="24"><text x="0" y="19" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" letter-spacing="-.5">uniagro</text><line x1="29" y1="1" x2="29" y2="6" stroke="#75B052" stroke-width="1.8"/><path d="M26 5 Q29 0 32 5" fill="#75B052"/></svg></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:100%"></div></div><div class="pgl"><span>Módulo 8 de 8 — Completado</span><span class="pgl-pct">100%</span></div></div>
    <div class="body">
      <div class="tabs">
        <button class="tab" [class.on]="tab()==='before'" (click)="tab.set('before')">Antes de asesoría</button>
        <button class="tab" [class.on]="tab()==='after'" (click)="tab.set('after')">Después de asesoría</button>
      </div>

      @if (tab()==='before') {
        <div class="note note-b"><i class="ti ti-info-circle" style="font-size:12px;vertical-align:-2px;margin-right:4px"></i>Este panel muestra el diagnóstico inicial con los datos que ingresaste.</div>
        <div class="stl">Semáforo de salud</div>
        <div class="sem sem-v"><div class="sem-row"><div class="sdot dv"></div><div><div class="sem-t">Hato registrado</div><div class="sem-d">Datos del hato capturados correctamente.</div></div></div></div>
        <div class="sem sem-a"><div class="sem-row"><div class="sdot da"></div><div><div class="sem-t">Carga animal inicial</div><div class="sem-d">{{ cargaMsg() }} Hay oportunidad de mejora.</div></div></div></div>
        <div class="sem sem-r"><div class="sem-row"><div class="sdot dr"></div><div><div class="sem-t">Sin programa profiláctico</div><div class="sem-d">No tienes plan sanitario activo. El veterinario lo definirá.</div></div></div></div>

        <div class="stl" style="margin-top:4px">Indicadores capturados</div>
        <div class="kpi-row" style="margin-bottom:14px">
          <div class="kpi"><div class="kl">Animales registrados</div><div class="kv">{{ svc.totalCabezas() || 0 }}</div><div class="ku">cabezas</div></div>
          <div class="kpi"><div class="kl">Carga animal</div><div class="kv" style="font-size:16px">{{ svc.cargaAnimal() ?? '—' }}</div><div class="ku">UGA/Mz</div></div>
          <div class="kpi"><div class="kl">Estado profilaxis</div><div class="kv" style="font-size:13px">Pendiente</div><div class="ku">diagnóstico</div></div>
          <div class="kpi"><div class="kl">Tecnificación</div><div class="kv" style="font-size:11px">{{ st().tecnificacion || '—' }}</div></div>
        </div>
      }

      @if (tab()==='after') {
        <div class="note note-g"><i class="ti ti-check-circle" style="font-size:12px;vertical-align:-2px;margin-right:4px"></i>Panel con indicadores y metas definidas después de la asesoría veterinaria.</div>
        <div class="stl">Semáforo de salud</div>
        <div class="sem sem-v"><div class="sem-row"><div class="sdot dv"></div><div><div class="sem-t">Hato en buen estado</div><div class="sem-d">Inventario y registros al día. Sigue así.</div></div></div></div>
        <div class="sem sem-a"><div class="sem-row"><div class="sdot da"></div><div><div class="sem-t">Carga animal por mejorar</div><div class="sem-d">1.3 UGA/Mz actual vs meta 2.5. Rotar potreros puede ayudar.</div></div></div></div>
        <div class="sem sem-r" style="margin-bottom:14px"><div class="sem-row"><div class="sdot dr"></div><div><div class="sem-t">Profilaxis vence pronto</div><div class="sem-d">Vitaminado en 3 días. Coordina con tu veterinario.</div></div></div></div>

        <div class="stl">Indicadores clave</div>
        <div class="kpi-row" style="margin-bottom:14px">
          <div class="kpi"><div class="kl">Inventario total</div><div class="kv">{{ svc.totalCabezas() || 87 }}</div><div class="ku">cabezas</div></div>
          <div class="kpi"><div class="kl">Carga animal</div><div class="kv">{{ svc.cargaAnimal() ?? '1.3' }}</div><div class="ku">UGA/Mz</div></div>
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
      }

      <button class="bn" (click)="menu()" style="margin-top:12px;background:var(--ua5)">
        <i class="ti ti-layout-grid" style="font-size:14px"></i> Volver al menú
      </button>
    </div>
  `,
})
export class M8Panel {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;
  tab = signal<'before'|'after'>('before');

  retos = [
    { nombre:'1er reto — Preñez 95%', pct:63, actual:'63%', meta:'95%' },
    { nombre:'2do reto — Peso 500 lb/7 meses', pct:82, actual:'410 lb', meta:'500 lb' },
    { nombre:'3er reto — Carga 2.5 UGA/Mz', pct:52, actual:'1.3', meta:'2.5' },
  ];
  inventario = [
    { nombre:'Vacas en producción', cnt:32, color:'var(--ua)' },
    { nombre:'Becerros 0–3 meses', cnt:18, color:'var(--g600)' },
    { nombre:'Novillas', cnt:15, color:'var(--a600)' },
    { nombre:'Toros', cnt:4, color:'var(--gr400)' },
    { nombre:'Enfermería', cnt:2, color:'var(--r600)' },
  ];

  cargaMsg() {
    const c = this.svc.cargaAnimal();
    return c ? `${c} UGA/Mz actual. Meta: 2.5.` : '1.3 UGA/Mz actual. Meta: 2.5.';
  }
  back() { window.history.back(); }
  menu() { this.router.navigate(['/menu']); }
}
