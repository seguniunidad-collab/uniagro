import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-m2-finca',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 2</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-home"></i></div>
      <div><div class="ht">Registro de la finca</div><div class="hs">Ubicación y área</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:25%"></div></div><div class="pgl">Módulo 2 de 8</div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-home"></i>Datos de la finca</div>
        <label>Nombre de la finca</label>
        <input type="text" placeholder="Ej. Finca El Rosario" [(ngModel)]="st.finca" (ngModelChange)="save('finca',$event)" />
        <label>Región / Municipio</label>
        <input type="text" placeholder="Ej. Escuintla, Guatemala" [(ngModel)]="st.region" (ngModelChange)="save('region',$event)" />
        <div class="g2" style="margin-top:8px">
          <div>
            <label style="margin-top:0">Área total</label>
            <input type="number" placeholder="0" [(ngModel)]="st.area" (ngModelChange)="save('area',$event)" />
          </div>
          <div>
            <label style="margin-top:0">Unidad</label>
            <select [(ngModel)]="st.unidad" (ngModelChange)="save('unidad',$event)">
              <option>Manzanas</option><option>Hectáreas</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-map-pin"></i>Geolocalización</div>
        <div class="gps-box">
          <div class="gps-icon"><i class="ti ti-current-location"></i></div>
          <div class="gps-info">
            <div class="gps-val" [class.captured]="gpsVal()">{{ gpsVal() || 'Sin capturar' }}</div>
            <div class="gps-sub">{{ gpsVal() ? 'Coordenadas capturadas' : 'Toca GPS para capturar' }}</div>
          </div>
          <button class="gps-btn" [class.loading]="gpsLoading()" (click)="captureGPS()">
            <i class="ti ti-gps"></i> {{ gpsLoading() ? 'Buscando...' : 'GPS' }}
          </button>
        </div>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-camera"></i>Fotografía</div>
        <div class="photo-box" [class.has-photo]="st.fotoFinca">
          @if (st.fotoFinca) {
            <img [src]="st.fotoFinca" alt="Foto finca" />
          } @else {
            <div class="photo-placeholder">
              <i class="ti ti-camera-plus"></i>
              <span>Tomar o subir foto</span>
            </div>
          }
        </div>
        <div class="photo-actions">
          <button class="photo-btn primary" (click)="takePhoto()"><i class="ti ti-camera"></i> Cámara</button>
          <button class="photo-btn" (click)="fileInput.click()"><i class="ti ti-upload"></i> Galería</button>
        </div>
        <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFile($event)" />
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
export class M2Finca {
  svc = inject(StateService);
  router = inject(Router);
  st = { ...this.svc.state() };
  gpsLoading = signal(false);
  showCam = signal(false);
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;

  gpsVal() { return this.svc.state().gps; }

  save(key: string, val: string) { this.svc.patch({ [key]: val } as any); }

  captureGPS() {
    this.gpsLoading.set(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const val = `${pos.coords.latitude.toFixed(4)}°N ${Math.abs(pos.coords.longitude).toFixed(4)}°W`;
        this.svc.patch({ gps: val });
        this.gpsLoading.set(false);
      },
      () => {
        this.svc.patch({ gps: 'No disponible' });
        this.gpsLoading.set(false);
      }
    );
  }

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
    const dataUrl = this.canvasEl.toDataURL('image/jpeg', 0.8);
    this.st.fotoFinca = dataUrl;
    this.svc.patch({ fotoFinca: dataUrl });
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
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      this.st.fotoFinca = dataUrl;
      this.svc.patch({ fotoFinca: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  back() { this.router.navigate(['/m1']); }
  next() { this.router.navigate(['/m3']); }
}
