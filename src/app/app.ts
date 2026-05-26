import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<div class="frame"><router-outlet /></div>`,
  styles: `:host{display:flex;flex-direction:column;flex:1;width:100%}`,
})
export class App {}
