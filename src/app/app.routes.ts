import { Routes } from '@angular/router';
import { Splash } from './components/splash/splash';
import { Menu } from './components/menu/menu';
import { M1Ganadero } from './components/m1-ganadero/m1-ganadero';
import { M2Finca } from './components/m2-finca/m2-finca';
import { M3Hato } from './components/m3-hato/m3-hato';
import { M4Condiciones } from './components/m4-condiciones/m4-condiciones';
import { M5Instalaciones } from './components/m5-instalaciones/m5-instalaciones';
import { M6Siniestros } from './components/m6-siniestros/m6-siniestros';
import { M7Profilaxis } from './components/m7-profilaxis/m7-profilaxis';
import { M8Panel } from './components/m8-panel/m8-panel';

export const routes: Routes = [
  { path: '', component: Splash },
  { path: 'menu', component: Menu },
  { path: 'm1', component: M1Ganadero },
  { path: 'm2', component: M2Finca },
  { path: 'm3', component: M3Hato },
  { path: 'm4', component: M4Condiciones },
  { path: 'm5', component: M5Instalaciones },
  { path: 'm6', component: M6Siniestros },
  { path: 'm7', component: M7Profilaxis },
  { path: 'm8', component: M8Panel },
  { path: '**', redirectTo: '' },
];
