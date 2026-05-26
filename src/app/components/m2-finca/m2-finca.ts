import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';
import { SearchDropdown } from '../search-dropdown/search-dropdown';
import { DEPTOS, DataService } from '../../services/data';

@Component({
  selector: 'app-m2-finca',
  imports: [FormsModule, SearchDropdown],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><div class="sb-logo"><div class="sb-dot"></div><span class="sb-wordmark">uni<span>agro</span></span></div><span class="sb-right">M2 · Finca</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hdr-brand"><div class="hdr-title">Registro de la finca</div><div class="hdr-sub">Ubicación y área</div></div>
      <div class="hdr-logo"><svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" width="70" height="24"><text x="0" y="19" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" letter-spacing="-.5">uniagro</text><line x1="29" y1="1" x2="29" y2="6" stroke="#75B052" stroke-width="1.8"/><path d="M26 5 Q29 0 32 5" fill="#75B052"/></svg></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:25%"></div></div><div class="pgl"><span>Módulo 2 de 8</span><span class="pgl-pct">25%</span></div></div>
    <div class="body">
      <div class="card">
        <div class="ct"><i class="ti ti-home"></i>Identificación</div>
        <label><span class="req">*</span> Nombre de la finca</label>
        <input type="text" placeholder="Ej. Finca El Rosario" [value]="st().finca" (input)="set('finca',$event)" />

        <label><span class="req">*</span> Departamento</label>
        <app-search-dropdown [items]="deptos" placeholder="Buscar departamento..."
          [value]="st().depto" (valueChange)="onDepto($event)">
        </app-search-dropdown>

        <label><span class="req">*</span> Municipio</label>
        <app-search-dropdown [items]="municipios()" placeholder="Buscar municipio..."
          [value]="st().municipio" (valueChange)="svc.patch({municipio:$event})">
        </app-search-dropdown>

        <label>Punto de referencia <span class="hint">(alfanumérico)</span></label>
        <input type="text" placeholder="Ej. 2km al norte del puente Los Esclavos" [value]="st().referencia" (input)="set('referencia',$event)" />
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-ruler-measure"></i>Área total de la finca</div>
        <div class="g2">
          <div>
            <label><span class="req">*</span> Área</label>
            <input type="number" placeholder="0" [value]="st().area" (input)="set('area',$event)" />
          </div>
          <div>
            <label><span class="req">*</span> Unidad</label>
            <select [value]="st().unidad" (change)="set('unidad',$event)">
              <option>Manzanas</option><option>Hectáreas</option>
              <option>Metros cuadrados</option><option>Cuerdas</option>
              <option>Caballerías</option><option>Acres</option><option>Varas cuadradas</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-map-pin"></i>Geolocalización</div>
        <div class="gps-box">
          <div class="gps-icon"><i class="ti ti-current-location"></i></div>
          <div class="gps-info">
            <div class="gps-val" [class.captured]="st().gps">{{ st().gps || 'Sin capturar' }}</div>
            <div class="gps-sub">{{ st().gps ? 'Coordenadas capturadas' : 'Alfanumérico — coordenadas GPS' }}</div>
          </div>
          <button class="gps-btn" [class.loading]="gpsLoading()" (click)="captureGPS()">
            <i class="ti ti-gps"></i> {{ gpsLoading() ? 'Buscando...' : 'GPS' }}
          </button>
        </div>
      </div>

      <div class="card">
        <div class="ct"><i class="ti ti-camera"></i>Fotografía de la finca <span class="hint" style="margin-left:4px">(opcional)</span></div>
        <div style="font-size:10px;color:var(--txt2);margin-bottom:8px">Foto general del predio o acceso principal.</div>
        <div class="photo-box" [class.has-photo]="st().fotoFinca">
          @if (st().fotoFinca) { <img [src]="st().fotoFinca" alt="Finca" /> }
          @else { <div class="photo-placeholder"><i class="ti ti-camera-plus"></i><span>Tomar o subir foto (opcional)</span></div> }
        </div>
        <div class="photo-actions">
          <button class="photo-btn primary" (click)="takePhoto()"><i class="ti ti-camera"></i> Cámara</button>
          <button class="photo-btn" (click)="fileInput.click()"><i class="ti ti-upload"></i> Galería</button>
        </div>
        <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFile($event)" />
      </div>
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:14px"></i></button>
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
  dataSvc = inject(DataService);
  router = inject(Router);
  st = this.svc.state;
  deptos = DEPTOS;
  gpsLoading = signal(false);
  showCam = signal(false);
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;

  municipios() { return this.dataSvc.getMunicipios(this.st().depto); }
  set(k: string, e: Event) { this.svc.patch({ [k]: (e.target as HTMLInputElement).value } as any); }
  onDepto(v: string) { this.svc.patch({ depto: v, municipio: '' }); }

  captureGPS() {
    this.gpsLoading.set(true);
    navigator.geolocation.getCurrentPosition(
      p => { this.svc.patch({ gps: `${p.coords.latitude.toFixed(4)}°N, ${Math.abs(p.coords.longitude).toFixed(4)}°W` }); this.gpsLoading.set(false); },
      () => { this.svc.patch({ gps: 'No disponible' }); this.gpsLoading.set(false); }
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
    this.canvasEl.width = this.videoEl.videoWidth; this.canvasEl.height = this.videoEl.videoHeight;
    this.canvasEl.getContext('2d')!.drawImage(this.videoEl, 0, 0);
    this.svc.patch({ fotoFinca: this.canvasEl.toDataURL('image/jpeg', 0.8) });
    this.closeCam();
  }
  closeCam() { this.stream?.getTracks().forEach(t => t.stop()); this.stream = null; this.showCam.set(false); }
  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => this.svc.patch({ fotoFinca: ev.target?.result as string }); r.readAsDataURL(f);
  }
  back() { window.history.back(); }
  next() { this.router.navigate(['/m3']); }
}
