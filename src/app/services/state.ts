import { Injectable, signal, computed } from '@angular/core';

export interface Animal {
  esp: string;
  prop: string;
  raza: string;
  cant: string;
  peso: string;
  edad: string;
  fierro: string;
  salud: string;
  foto: string;
}

export interface AppState {
  nombre: string; dpi: string; telefono: string; credito: string; agencia: string;
  finca: string; region: string; area: string; unidad: string; gps: string; fotoFinca: string;
  animales: Animal[];
  tienePasto: string; areaP: string; totalAnim: string; fuenteAgua: string; tienePozo: string;
  tecnificacion: string; desechos: string; obsInstalaciones: string;
  tipoSiniestro: string; idAnimal: string; espSiniestro: string; fechaSiniestro: string;
  descSiniestro: string; fotoSiniestro: string;
}

const STORAGE_KEY = 'uniagro_state';

const defaultState: AppState = {
  nombre: '', dpi: '', telefono: '', credito: '', agencia: '',
  finca: '', region: '', area: '', unidad: 'Manzanas', gps: '', fotoFinca: '',
  animales: [],
  tienePasto: '', areaP: '', totalAnim: '', fuenteAgua: '', tienePozo: '',
  tecnificacion: '', desechos: '', obsInstalaciones: '',
  tipoSiniestro: '', idAnimal: '', espSiniestro: '', fechaSiniestro: '',
  descSiniestro: '', fotoSiniestro: '',
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private _state = signal<AppState>(this.load());

  readonly state = this._state.asReadonly();

  readonly cargaAnimal = computed(() => {
    const area = parseFloat(this._state().areaP) || 0;
    const anim = parseFloat(this._state().totalAnim) || 0;
    if (area > 0 && anim > 0) return (anim / area).toFixed(2);
    return null;
  });

  patch(partial: Partial<AppState>) {
    this._state.update(s => {
      const next = { ...s, ...partial };
      this.save(next);
      return next;
    });
  }

  addAnimal(a: Animal) {
    this._state.update(s => {
      const next = { ...s, animales: [...s.animales, a] };
      this.save(next);
      return next;
    });
  }

  removeAnimal(idx: number) {
    this._state.update(s => {
      const animales = s.animales.filter((_, i) => i !== idx);
      const next = { ...s, animales };
      this.save(next);
      return next;
    });
  }

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this._state.set({ ...defaultState, animales: [] });
  }

  private load(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
    } catch {
      return { ...defaultState };
    }
  }

  private save(s: AppState) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }
}
