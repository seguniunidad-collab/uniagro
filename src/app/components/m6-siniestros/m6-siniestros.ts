import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m6-siniestros',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 6</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-alert-triangle"></i></div>
      <div><div class="ht">Registro de siniestros</div><div class="hs">Reportar un evento</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:75%"></div></div><div class="pgl">Módulo 6 de 8</div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-alert-circle"></i>Tipo de evento</div>
        <div class="pill-row" style="margin-top:4px">
          @for (op of tipos; track op) {
            <div class="pill" [class.on]="st().tipoSiniestro===op" (click)="set('tipoSiniestro',op)">{{ op }}</div>
          }
        </div>
      </div>
      <div class="card">
        <div class="ct"><i class="ti ti-list-details"></i>Detalle del animal</div>
        <label>ID / Número del animal</label>
        <input type="text" placeholder="Ej. BDA-045" [value]="st().idAnimal" (input)="set('idAnimal',getValue($event))" />
        <div class="g2" style="margin-top:8px">
          <div>
            <label style="margin-top:0">Especie</label>
            <select [value]="st().espSiniestro" (change)="set('espSiniestro',getValue($event))">
              <option value="">Seleccionar</option>
              <option>Bovino</option><option>Porcino</option><option>Avícola</option>
            </select>
          </div>
          <div>
            <label style="margin-top:0">Fecha del evento</label>
            <input type="text" placeholder="dd/mm/aaaa" [value]="st().fechaSiniestro" (input)="set('fechaSiniestro',getValue($event))" />
          </div>
        </div>
        <label>Descripción del evento</label>
        <textarea style="height:60px;resize:none" placeholder="Describe brevemente lo que ocurrió..."
          [value]="st().descSiniestro" (input)="set('descSiniestro',getValue($event))"></textarea>
      </div>
      <div class="card">
        <div class="ct"><i class="ti ti-camera"></i>Evidencia fotográfica</div>
        <div class="photo-box" [class.has-photo]="st().fotoSiniestro">
          @if (st().fotoSiniestro) {
            <img [src]="st().fotoSiniestro" alt="Evidencia" />
          } @else {
            <div class="photo-placeholder"><i class="ti ti-camera-plus"></i><span>Foto del animal o del evento</span></div>
          }
        </div>
        <div class="photo-actions">
          <button class="photo-btn primary" (click)="takePhoto()"><i class="ti ti-camera"></i> Cámara</button>
          <button class="photo-btn" (click)="fileInput.click()"><i class="ti ti-upload"></i> Galería</button>
        </div>
        <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFile($event)" />
      </div>
      <div class="sin-badge">
        <i class="ti ti-phone-call"></i>
        <div>Emergencia 24/7: <strong>1800-UNIAGRO</strong> · Telemedicina veterinaria disponible</div>
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:15px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:15px"></i></button>
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
  tipos = ['Muerte','Accidente','Enfermedad','Sacrificio forzoso','Fenómeno natural'];
  showCam = signal(false);
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;

  set(key: string, val: string) { this.svc.patch({ [key]: val } as any); }
  getValue(e: Event) { return (e.target as HTMLInputElement).value; }

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
    this.canvasEl.width = this.videoEl.videoWidth;
    this.canvasEl.height = this.videoEl.videoHeight;
    this.canvasEl.getContext('2d')!.drawImage(this.videoEl, 0, 0);
    this.svc.patch({ fotoSiniestro: this.canvasEl.toDataURL('image/jpeg', 0.8) });
    this.closeCam();
  }

  closeCam() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.showCam.set(false);
  }

  onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { this.svc.patch({ fotoSiniestro: ev.target?.result as string }); };
    reader.readAsDataURL(file);
  }

  back() { this.router.navigate(['/m5']); }
  next() { this.router.navigate(['/m7']); }
}
