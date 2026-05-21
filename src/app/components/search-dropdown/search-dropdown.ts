import { Component, Input, Output, EventEmitter, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-dropdown',
  imports: [FormsModule],
  template: `
    <div class="search-wrap">
      <i class="ti ti-search s-icon"></i>
      <input type="text" [placeholder]="placeholder" [(ngModel)]="query"
        (input)="onInput()" (focus)="onInput()" />
    </div>
    @if (open() && filtered().length) {
      <div class="dropdown-list">
        @for (item of filtered(); track item) {
          <div class="dropdown-item" (mousedown)="select(item)">{{ item }}</div>
        }
      </div>
    }
  `,
  styles: ``,
})
export class SearchDropdown {
  @Input() items: string[] = [];
  @Input() placeholder = 'Buscar...';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  query = '';
  open = signal(false);
  filtered = signal<string[]>([]);

  ngOnChanges() { this.query = this.value; }

  onInput() {
    const q = this.query.toLowerCase().trim();
    this.filtered.set(q ? this.items.filter(i => i.toLowerCase().includes(q)).slice(0, 12) : this.items.slice(0, 12));
    this.open.set(true);
  }

  select(item: string) {
    this.query = item;
    this.valueChange.emit(item);
    this.open.set(false);
  }

  @HostListener('document:click')
  clickOut() { this.open.set(false); }
}
