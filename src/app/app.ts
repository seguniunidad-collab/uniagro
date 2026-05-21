import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<div class="frame"><router-outlet /></div>`,
  styles: `
    :host { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; }
  `,
})
export class App {}
