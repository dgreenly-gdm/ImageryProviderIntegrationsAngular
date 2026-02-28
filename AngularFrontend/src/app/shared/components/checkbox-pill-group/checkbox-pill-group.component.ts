import { Component, input, output } from '@angular/core';

export interface PillOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-checkbox-pill-group',
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-2">
      @for (option of options(); track option.value) {
        @let selected = values().includes(option.value);
        <button type="button"
                class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                [class]="selected ? 'text-white border-transparent' : 'text-muted-foreground border-border hover:border-foreground/30'"
                [style.background-color]="selected ? accentColor() : 'transparent'"
                (click)="toggle(option.value)">
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class CheckboxPillGroupComponent {
  options = input.required<PillOption[]>();
  values = input.required<string[]>();
  accentColor = input<string>('#3B82F6');
  valuesChange = output<string[]>();

  toggle(value: string): void {
    const current = this.values();
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    this.valuesChange.emit(next);
  }
}
