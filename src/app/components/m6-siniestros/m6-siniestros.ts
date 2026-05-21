import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m6-siniestros',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>M6</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-alert-triangle"></i></div>
      <div><div class="ht">Registro de siniestros</div><div class="hs">Reportar fallecimiento</div></div>
      <span class="role-tag"><i class="ti ti-lock" style="font-size:10px"></i> Solo agente</span>
    </div>
    <div class="body">
      <div class="note note-a"><i class="ti ti-info-circle" style="font-size:12px;vertical-align:-2px;margin-right:4px"></i>Este módulo está habilitado según el perfil del usuario. No forma parte del flujo secuencial del productor.</div>

      <div class="card">
        <div class="ct"><i class="ti ti-alert-circle"></i>Tipo de fallecimiento</div>
        <div class="pill-row" style="margin-top:4px">
          <div class="pill" [class.on]="st().tipoSiniestro==='accidente'" (click)="setTipo('accidente')">Accidente / Fenómeno nat.</div>
          <div class="pill" [class.on]="st().tipoSiniestro==='enfermedad'" (click)="setTipo('enfermedad')">Enfermedad</div>
        </div>

        @if (st().tipoSiniestro==='accidente') {
          <div style="margin-top:10px">
            <label>Causa del accidente</label>
            <div class="pill-row">
              @for (c of causas; track c) {
                <div class="pill" [class.on]="st().causaAccidente===c" (click)="set('causaAccidente',c)">{{ c }}</div>
              }
            </div>
            @if (st().causaAccidente==='Otro') {
              <input type="text" placeholder="Describir causa..." style="margin-top:6px"
                [value]="st().descSiniestro" (input)="set('descSiniestro',getVal($event))" />
            }
          </div>
        }

        @if (st().tipoSiniestro==='enfermedad') {
          <div style="margin-top:10px">
            <label>Descripción de la enfermedad</label>
            <textarea placeholder="Describe los síntomas o diagnóstico..."
              [value]="st().descEnfermedad" (input)="set('descEnfermedad',getVal($event))"></textarea>
          </div>
        }
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-list-details"></i>Detalle del animal</div>
        <label>ID / Número del animal <span class="hint">(alfanumérico)</span></label>
        <input type="text" placeholder="Ej. BDA-045 o número de arete" [value]="st().idAnimal" (input)="set('idAnimal',getVal($event))" />
        <div class="g2" style="margin-top:0">
          <div>
            <label>Especie</label>
            <select [value]="st().espSiniestro" (change)="set('espSiniestro',getVal($event))">
              <option value="">Seleccionar</option>
              <option>Bovino</option><option>Porcino</option><option>Avícola</option>
            </select>
          </div>
          <div>
            <label>Fecha del evento</label>
            <input type="date" [value]="st().fechaSiniestro" (input)="set('fechaSiniestro',getVal($event))" />
          </div>
        </div>
        <label>Descripción del evento <span class="hint">(texto)</span></label>
        <textarea placeholder="Describe brevemente lo que ocurrió..."
          [value]="st().descSiniestro" (input)="set('descSiniestro',getVal($event))"></textarea>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-camera"></i>Evidencia fotográfica <span class="hint" style="margin-left:4px">(opcional)</span></div>
        <div class="photo-box" [class.has-photo]="st().fotoSiniestro">
          @if (st().fotoSiniestro) { <img [src]="st().fotoSiniestro" alt="Evidencia" /> }
          @else { <div class="photo-placeholder"><i class="ti ti-camera-plus"></i><span>Foto del animal o del evento (opcional)</span></div> }
        </div>
        <div class="photo-actions">
          <button class="photo-btn primary" (click)="takePhoto()"><i class="ti ti-camera"></i> Cámara</button>
          <button class="photo-btn" (click)="fileInput.click()"><i class="ti ti-upload"></i> Galería</button>
        </div>
        <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFile($event)" />
      </div>

      <div class="note note-r"><i class="ti ti-phone-call" style="font-size:12px;vertical-align:-2px;margin-right:4px"></i>Emergencia 24/7: <strong>1800-UNIAGRO</strong> · Telemedicina veterinaria</div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" style="background:var(--r600)" (click)="back()">Reportar siniestro <i class="ti ti-send" style="font-size:14px"></i></button>
    </div>

    @if (showCam()) {
      <div class="cam-overlay">
        <video #camVideo class="cam-video" autoplay playsinline></video>
        <div class="cam-actions">
          <button class="cam-snap" (click)="snap()"><i class="ti ti-camera"></i></button>
          <button class="cam-cancel" (click)="closeCam()">Cancelar</button>
        </div>
      </div>
    }
    <canvas #camCanvas style="display:none"></canvas>
  `,
})
export class M6Siniestros {
  svc = inject(StateService);
  router = inject(Router);
  st = this.svc.state;
  showCam = signal(false);
  causas = ['⚡ Rayo','🌊 Inundación','🐍 Mordedura serpiente','⛰️ Desbarrancamiento','🦁 Depredador','🚗 Choque','🔨 Vandalismo','Otro'];
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;

  set(k: string, v: string) { this.svc.patch({ [k]: v } as any); }
  getVal(e: Event) { return (e.target as HTMLInputElement).value; }
  setTipo(t: string) { this.svc.patch({ tipoSiniestro: t, causaAccidente: '' }); }

  takePhoto() {
    this.showCam.set(true);
    setTimeout(() => {
      this.videoEl = document.querySelector('.cam-video') as HTMLVideoElement;
      this.canvasEl = document.querySelector('canvas') as HTMLCanvasElement;
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => { this.stream = s; if (this.videoEl) this.videoEl.srcObject = s; })
        .catch(() => this.closeCam());
    }, 100);
  }
  snap() {
    if (!this.videoEl || !this.canvasEl) return;
    this.canvasEl.width = this.videoEl.videoWidth; this.canvasEl.height = this.videoEl.videoHeight;
    this.canvasEl.getContext('2d')!.drawImage(this.videoEl, 0, 0);
    this.svc.patch({ fotoSiniestro: this.canvasEl.toDataURL('image/jpeg', 0.8) });
    this.closeCam();
  }
  closeCam() { this.stream?.getTracks().forEach(t => t.stop()); this.stream = null; this.showCam.set(false); }
  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => this.svc.patch({ fotoSiniestro: ev.target?.result as string }); r.readAsDataURL(f);
  }
  back() { this.router.navigate(['/menu']); }
}
