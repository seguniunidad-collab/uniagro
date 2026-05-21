import { Injectable, signal, computed } from '@angular/core';

export interface Animal {
  esp: string; prop: string; raza: string; cant: string;
  peso: string; edad: string; fierro: string; salud: string;
  foto1: string; foto2: string; foto3: string;
}

export interface AppState {
  // M1
  nombre: string; dpi1: string; dpi2: string; nit: string; telefono: string;
  credito: string; agencia: string;
  // M2
  finca: string; depto: string; municipio: string; referencia: string;
  area: string; unidad: string; gps: string; fotoFinca: string;
  // M3
  animales: Animal[];
  // M4
  tienePasto: string; areaP: string; unidadP: string; totalAnim: string;
  fuentesAgua: string[]; alimentacion: string;
  // M5
  tecnificacion: string; desechos: string[]; obsInstalaciones: string;
  // M6
  tipoSiniestro: string; causaAccidente: string; descEnfermedad: string;
  idAnimal: string; espSiniestro: string; fechaSiniestro: string;
  descSiniestro: string; fotoSiniestro: string;
  // M7
  tieneVacunacion: string; tieneDesparasitacion: string; tieneVitaminas: string;
  ultimoTratamiento: string; obsSanitarias: string;
}

const STORAGE_KEY = 'uniagro_v2_state';

const defaultState: AppState = {
  nombre:'', dpi1:'', dpi2:'', nit:'', telefono:'', credito:'', agencia:'',
  finca:'', depto:'', municipio:'', referencia:'', area:'', unidad:'Manzanas', gps:'', fotoFinca:'',
  animales:[],
  tienePasto:'', areaP:'', unidadP:'Manzanas', totalAnim:'', fuentesAgua:[], alimentacion:'',
  tecnificacion:'', desechos:[], obsInstalaciones:'',
  tipoSiniestro:'', causaAccidente:'', descEnfermedad:'', idAnimal:'',
  espSiniestro:'', fechaSiniestro:'', descSiniestro:'', fotoSiniestro:'',
  tieneVacunacion:'', tieneDesparasitacion:'', tieneVitaminas:'',
  ultimoTratamiento:'', obsSanitarias:'',
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

  readonly totalCabezas = computed(() =>
    this._state().animales.reduce((s, a) => s + (parseInt(a.cant) || 0), 0)
  );

  patch(partial: Partial<AppState>) {
    this._state.update(s => { const n = { ...s, ...partial }; this.save(n); return n; });
  }

  toggleArray(key: 'fuentesAgua' | 'desechos', val: string) {
    this._state.update(s => {
      const arr = [...s[key]];
      const idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
      const n = { ...s, [key]: arr };
      this.save(n);
      return n;
    });
  }

  addAnimal(a: Animal) {
    this._state.update(s => { const n = { ...s, animales: [...s.animales, a] }; this.save(n); return n; });
  }

  removeAnimal(idx: number) {
    this._state.update(s => {
      const animales = s.animales.filter((_, i) => i !== idx);
      const n = { ...s, animales }; this.save(n); return n;
    });
  }

  reset() { localStorage.removeItem(STORAGE_KEY); this._state.set({ ...defaultState, animales:[], fuentesAgua:[], desechos:[] }); }

  private load(): AppState {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? { ...defaultState, ...JSON.parse(r) } : { ...defaultState }; }
    catch { return { ...defaultState }; }
  }
  private save(s: AppState) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }
}
