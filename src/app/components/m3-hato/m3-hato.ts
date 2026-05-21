import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService, Animal } from '../../services/state';
import { SearchDropdown } from '../search-dropdown/search-dropdown';
import { RAZAS, PROPOSITOS } from '../../services/data';

const ESP_ICONS: Record<string, string> = { bovino:'ti-garden-cart', porcino:'ti-pig', avicola:'ti-feather' };
const ESP_LABELS: Record<string, string> = { bovino:'🐄 Bovino', porcino:'🐖 Porcino', avicola:'🐓 Avícola' };

@Component({
  selector: 'app-m3-hato',
  imports: [FormsModule, SearchDropdown],
  styles: `:host{display:flex;flex-direction:column;flex:1}`,
  template: `
    <div class="sb"><span>uniagro</span><span>M3</span></div>
    <div class="hdr">
      <button class="hbk" (click)="back()"><i class="ti ti-arrow-left"></i></button>
      <div class="hico"><i class="ti ti-garden-cart"></i></div>
      <div><div class="ht">Registro del hato</div><div class="hs">Registro individual por animal</div></div>
    </div>
    <div class="pgw"><div class="pgt"><div class="pgf" style="width:37%"></div></div><div class="pgl">Módulo 3 de 8</div></div>
    <div class="body">
      <div class="animal-list">
        @for (a of svc.state().animales; track $index) {
          <div class="acard">
            <div class="aico"><i class="ti {{ iconFor(a.esp) }}"></i></div>
            <div class="ainfo">
              <div class="an">{{ labelFor(a.esp) }} {{ a.prop ? '· '+a.prop : '' }}</div>
              <div class="as2">{{ a.raza }} · {{ a.cant }} cabezas · {{ a.peso }} lb</div>
            </div>
            <button class="adel" (click)="svc.removeAnimal($index)"><i class="ti ti-trash"></i></button>
          </div>
        }
      </div>

      @if (!showForm()) {
        <button class="add-btn" (click)="openModal()">
          <i class="ti ti-plus" style="font-size:15px"></i> Agregar animal
        </button>
      }
      @if (!svc.state().animales.length && !showForm()) {
        <div class="empty-msg">Aún no has registrado animales.<br>Toca el botón para empezar.</div>
      }

      @if (showForm()) {
        <div class="card" style="border-color:var(--ua4);background:var(--ua3)">
          <div class="ct" style="color:var(--ua5)">
            <i class="ti ti-edit"></i>Nuevo animal
            <span style="margin-left:auto;font-size:10px;color:var(--ua);font-weight:700">({{ modalCant() }} animales)</span>
          </div>

          <label style="margin-top:0"><span class="req">*</span> Especie</label>
          <div class="pill-row">
            @for (e of especies; track e.key) {
              <div class="pill" [class.on]="form.esp===e.key" (click)="selEsp(e.key)">{{ e.label }}</div>
            }
          </div>

          @if (form.esp) {
            <label><span class="req">*</span> Propósito</label>
            <div class="pill-row">
              @for (p of propositos(); track p) {
                <div class="pill" [class.on]="form.prop===p" (click)="form.prop=p">{{ p }}</div>
              }
            </div>
          }

          <label><span class="req">*</span> Raza <span class="hint">(busca por nombre)</span></label>
          <app-search-dropdown [items]="razas()" placeholder="Escribe para buscar raza..."
            [value]="form.raza" (valueChange)="form.raza=$event">
          </app-search-dropdown>

          <div class="g2" style="margin-top:8px">
            <div><label><span class="req">*</span> Cantidad</label><input type="number" [value]="form.cant" (input)="form.cant=getVal($event)" placeholder="0" /></div>
            <div><label><span class="req">*</span> Peso (lb)</label><input type="number" [value]="form.peso" (input)="form.peso=getVal($event)" placeholder="0" /></div>
          </div>
          <div class="g2">
            <div>
              <label><span class="req">*</span> Edad <span class="hint">({{ form.esp==='avicola' ? 'semanas' : 'meses' }})</span></label>
              <input type="number" [value]="form.edad" (input)="form.edad=getVal($event)" placeholder="0" />
            </div>
            <div>
              <label><span class="req">*</span> {{ fierroLabel() }}</label>
              <input type="text" [value]="form.fierro" (input)="form.fierro=getVal($event)" placeholder="Ej. FER-01" />
            </div>
          </div>

          <label><span class="req">*</span> Estado de salud</label>
          <div class="pill-row">
            @for (s of saludes; track s) {
              <div class="pill" [class.on]="form.salud===s" (click)="form.salud=s">{{ s }}</div>
            }
          </div>

          @if (form.esp==='avicola') {
            <label>Número de galpón</label>
            <input type="text" placeholder="Ej. Galpón 1" />
          }

          <label><span class="req">*</span> Fotografías del animal</label>
          <div class="foto-grid">
            <div class="foto-box" [class.taken]="form.foto1" (click)="takePhoto(1)">
              @if (form.foto1) { <img [src]="form.foto1" /> }
              @else { <i class="ti ti-camera"></i><span>Vista lateral</span> }
            </div>
            <div class="foto-box" [class.taken]="form.foto2" (click)="takePhoto(2)">
              @if (form.foto2) { <img [src]="form.foto2" /> }
              @else { <i class="ti ti-camera"></i><span>Vista frontal</span> }
            </div>
            <div class="foto-box" [class.taken]="form.foto3" (click)="takePhoto(3)">
              @if (form.foto3) { <img [src]="form.foto3" /> }
              @else { <i class="ti ti-camera"></i><span>Vista trasera</span> }
            </div>
          </div>
          <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFile($event)" />

          <button style="width:100%;padding:10px;background:var(--ua);color:#fff;border:none;border-radius:var(--rad);font-size:13px;font-weight:700;cursor:pointer;margin-top:12px;font-family:inherit" (click)="save()">
            <i class="ti ti-check" style="font-size:13px;vertical-align:-2px;margin-right:4px"></i>Guardar animal
          </button>
          <button (click)="cancel()" style="width:100%;padding:7px;background:transparent;border:none;color:var(--txt2);font-size:12px;cursor:pointer;margin-top:4px;font-family:inherit">Cancelar</button>
        </div>
      }
    </div>
    <div class="nf">
      <button class="bb" (click)="back()"><i class="ti ti-arrow-left" style="font-size:14px"></i></button>
      <button class="bn" (click)="next()">Continuar <i class="ti ti-arrow-right" style="font-size:14px"></i></button>
    </div>

    @if (showModal()) {
      <div class="modal-overlay">
        <div class="modal-box">
          <div class="modal-t">¿Cuántos animales vas a agregar?</div>
          <div class="modal-d">Ingresa la cantidad de animales de la misma especie.</div>
          <input type="number" [(ngModel)]="modalInput" placeholder="Ej. 5"
            style="width:100%;font-size:16px;padding:10px;border:1px solid var(--brd2);border-radius:var(--rad);margin-bottom:14px;font-family:inherit" />
          <div class="modal-btns">
            <button class="modal-cancel" (click)="showModal.set(false)">Cancelar</button>
            <button class="modal-ok" (click)="confirmModal()">Continuar</button>
          </div>
        </div>
      </div>
    }

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
  showModal = signal(false);
  showCam = signal(false);
  modalInput = 1;
  modalCant = signal(1);
  currentPhotoSlot = 1;
  especies = Object.keys(ESP_LABELS).map(k => ({ key: k, label: ESP_LABELS[k] }));
  saludes = ['Bueno','Regular','Con tratamiento','Cuarentena'];
  form = this.emptyForm();
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;

  emptyForm(): Animal { return { esp:'', prop:'', raza:'', cant:'', peso:'', edad:'', fierro:'', salud:'', foto1:'', foto2:'', foto3:'' }; }
  iconFor(esp: string) { return ESP_ICONS[esp] ?? 'ti-garden-cart'; }
  labelFor(esp: string) { return ESP_LABELS[esp] ?? esp; }
  razas() { return RAZAS[this.form.esp] ?? []; }
  propositos() { return PROPOSITOS[this.form.esp] ?? []; }
  fierroLabel() { return this.form.esp==='bovino' ? 'Fierro / Arete' : this.form.esp==='porcino' ? 'Arete / Tatuaje' : 'ID Galpón'; }
  getVal(e: Event) { return (e.target as HTMLInputElement).value; }

  selEsp(esp: string) { this.form.esp = esp; this.form.prop = ''; this.form.raza = ''; }

  openModal() { this.showModal.set(true); this.modalInput = 1; }
  confirmModal() { this.modalCant.set(this.modalInput || 1); this.form = this.emptyForm(); this.form.cant = String(this.modalCant()); this.showModal.set(false); this.showForm.set(true); }

  save() { this.svc.addAnimal({ ...this.form }); this.form = this.emptyForm(); this.showForm.set(false); }
  cancel() { this.form = this.emptyForm(); this.showForm.set(false); }

  takePhoto(slot: number) {
    this.currentPhotoSlot = slot;
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
    const data = this.canvasEl.toDataURL('image/jpeg', 0.8);
    if (this.currentPhotoSlot === 1) this.form.foto1 = data;
    else if (this.currentPhotoSlot === 2) this.form.foto2 = data;
    else this.form.foto3 = data;
    this.closeCam();
  }
  closeCam() { this.stream?.getTracks().forEach(t => t.stop()); this.stream = null; this.showCam.set(false); }
  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => {
      const data = ev.target?.result as string;
      if (this.currentPhotoSlot === 1) this.form.foto1 = data;
      else if (this.currentPhotoSlot === 2) this.form.foto2 = data;
      else this.form.foto3 = data;
    }; r.readAsDataURL(f);
  }
  back() { this.router.navigate(['/m2']); }
  next() { this.router.navigate(['/m4']); }
}
