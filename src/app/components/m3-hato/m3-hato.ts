import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService, Animal } from '../../services/state';

const ICON_MAP: Record<string, string> = {
  Bovino: 'ti-garden-cart', Porcino: 'ti-pig', Avícola: 'ti-feather',
};

@Component({
  selector: 'app-m3-hato',
  imports: [FormsModule],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>Módulo 3</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-garden-cart"></i></div>
      <div><div class="ht">Registro del hato</div><div class="hs">Agrega cada grupo de animales</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:37%"></div></div><div class="pgl">Módulo 3 de 8</div></div>
    <div class="body">
      <div class="animal-list">
        @for (a of svc.state().animales; track $index) {
          <div class="acard">
            <div class="aico"><i class="ti {{ iconFor(a.esp) }}"></i></div>
            <div class="ainfo">
              <div class="an">{{ a.esp }} · {{ a.prop }}</div>
              <div class="as2">{{ a.raza }} · {{ a.cant }} animales · {{ a.peso }} lb prom.</div>
            </div>
            <button class="adel" (click)="svc.removeAnimal($index)"><i class="ti ti-trash"></i></button>
          </div>
        }
      </div>

      @if (!showForm()) {
        <button class="add-btn" (click)="showForm.set(true)">
          <i class="ti ti-plus" style="font-size:16px"></i> Agregar grupo de animales
        </button>
      }

      @if (svc.state().animales.length === 0 && !showForm()) {
        <div class="empty-msg">Aún no has agregado animales.<br>Toca el botón azul para empezar.</div>
      }

      @if (showForm()) {
        <div class="add-form">
          <div class="af-title"><i class="ti ti-edit" style="font-size:14px"></i>Nuevo grupo</div>
          <label style="margin-top:0">Especie</label>
          <div class="pill-row">
            @for (op of ['Bovino','Porcino','Avícola']; track op) {
              <div class="pill" [class.on]="form.esp===op" (click)="form.esp=op">{{ op }}</div>
            }
          </div>
          <label>Propósito</label>
          <div class="pill-row">
            @for (op of ['Lechero','Engorde','Crianza','Doble prop.']; track op) {
              <div class="pill" [class.on]="form.prop===op" (click)="form.prop=op">{{ op }}</div>
            }
          </div>
          <label>Raza</label>
          <input type="text" placeholder="Ej. Brahman, Holstein..." [(ngModel)]="form.raza" />
          <div class="g2" style="margin-top:8px">
            <div><label style="margin-top:0">Cantidad</label><input type="number" placeholder="0" [(ngModel)]="form.cant" /></div>
            <div><label style="margin-top:0">Peso prom. (lb)</label><input type="number" placeholder="0" [(ngModel)]="form.peso" /></div>
          </div>
          <div class="g2" style="margin-top:8px">
            <div><label style="margin-top:0">Edad prom. (meses)</label><input type="number" placeholder="0" [(ngModel)]="form.edad" /></div>
            <div><label style="margin-top:0">Fierro / Marca</label><input type="text" placeholder="Ej. FER-01" [(ngModel)]="form.fierro" /></div>
          </div>
          <label>Estado de salud</label>
          <div class="pill-row">
            @for (op of ['Bueno','Regular','Con tratamiento']; track op) {
              <div class="pill" [class.on]="form.salud===op" (click)="form.salud=op">{{ op }}</div>
            }
          </div>
          <label>Foto del grupo</label>
          <div class="photo-box" [class.has-photo]="form.foto" style="margin-bottom:4px">
            @if (form.foto) {
              <img [src]="form.foto" alt="Foto grupo" />
            } @else {
              <div class="photo-placeholder"><i class="ti ti-camera"></i><span>Agregar foto</span></div>
            }
          </div>
          <div class="photo-actions">
            <button class="photo-btn primary" (click)="takePhoto()"><i class="ti ti-camera"></i> Cámara</button>
            <button class="photo-btn" (click)="fileInput.click()"><i class="ti ti-upload"></i> Galería</button>
          </div>
          <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFile($event)" />
          <button class="af-save" (click)="save()"><i class="ti ti-check" style="font-size:14px;vertical-align:-2px;margin-right:4px"></i>Guardar grupo</button>
          <button (click)="cancel()" style="width:100%;padding:7px;background:transparent;border:none;color:var(--txt2);font-size:12px;cursor:pointer;margin-top:4px;font-family:inherit">Cancelar</button>
        </div>
      }
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
export class M3Hato {
  svc = inject(StateService);
  router = inject(Router);
  showForm = signal(false);
  showCam = signal(false);
  form: Animal = this.emptyForm();
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;

  iconFor(esp: string) { return ICON_MAP[esp] ?? 'ti-garden-cart'; }

  emptyForm(): Animal {
    return { esp: '', prop: '', raza: '', cant: '', peso: '', edad: '', fierro: '', salud: '', foto: '' };
  }

  save() {
    this.svc.addAnimal({ ...this.form });
    this.form = this.emptyForm();
    this.showForm.set(false);
  }

  cancel() { this.form = this.emptyForm(); this.showForm.set(false); }

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
    this.form.foto = this.canvasEl.toDataURL('image/jpeg', 0.8);
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
    reader.onload = ev => { this.form.foto = ev.target?.result as string; };
    reader.readAsDataURL(file);
  }

  back() { this.router.navigate(['/m2']); }
  next() { this.router.navigate(['/m4']); }
}
